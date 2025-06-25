const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const WebSocket = require('ws');
const { IncomingForm } = require('formidable');

// SISTEMA DE PROTEÇÃO - GARANTIA 100% DE FUNCIONALIDADE
const ServerProtection = require('./server-backup');
const serverProtection = new ServerProtection();

const PORT = 8080;
const PAINEL_FILE = path.join(__dirname, 'painel.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

// Função para ler dados do painel
function readPainelData() {
    try {
        if (!fs.existsSync(PAINEL_FILE)) {
            // Dados padrão
            const defaultData = {
                saldoDisponivel: 0,
                saldoReceber: 0,
                taxaPagar: 0,
                nomeMotorista: '',
                placaCarro: '',
                modeloMotorista: '',
                ligado: false
            };
            fs.writeFileSync(PAINEL_FILE, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        
        const data = JSON.parse(fs.readFileSync(PAINEL_FILE));
        
        // VALIDAÇÃO DE INTEGRIDADE - Garante que os dados estão corretos
        const validatedData = validatePanelData(data);
        if (!validatedData) {
            console.warn('⚠️ Dados do painel corrompidos, restaurando backup...');
            serverProtection.restoreFile(PAINEL_FILE);
            return readPainelData(); // Tenta ler novamente
        }
        
        return validatedData;
    } catch (e) {
        console.error('❌ Erro ao ler dados do painel:', e.message);
        // Tenta restaurar do backup
        serverProtection.restoreFile(PAINEL_FILE);
        return {
            saldoDisponivel: 0,
            saldoReceber: 0,
            taxaPagar: 0,
            nomeMotorista: '',
            placaCarro: '',
            modeloMotorista: '',
            ligado: false
        };
    }
}

// Função para validar dados do painel
function validatePanelData(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    
    // Verifica campos obrigatórios
    const requiredFields = ['saldoDisponivel', 'saldoReceber', 'taxaPagar', 'ligado'];
    for (const field of requiredFields) {
        if (!(field in data)) {
            console.error(`❌ Campo obrigatório ausente: ${field}`);
            return false;
        }
    }
    
    // Valida tipos de dados
    if (typeof data.saldoDisponivel !== 'number' || data.saldoDisponivel < 0) {
        console.error('❌ Saldo disponível inválido:', data.saldoDisponivel);
        return false;
    }
    
    if (typeof data.saldoReceber !== 'number' || data.saldoReceber < 0) {
        console.error('❌ Saldo a receber inválido:', data.saldoReceber);
        return false;
    }
    
    if (typeof data.taxaPagar !== 'number' || data.taxaPagar < 0) {
        console.error('❌ Taxa a pagar inválida:', data.taxaPagar);
        return false;
    }
    
    if (typeof data.ligado !== 'boolean') {
        console.error('❌ Status ligado inválido:', data.ligado);
        return false;
    }
    
    return true;
}

// Função para salvar dados do painel
function savePainelData(data) {
    try {
        // VALIDAÇÃO ANTES DE SALVAR - Garante que os dados são válidos
        if (!validatePanelData(data)) {
            console.error('❌ Tentativa de salvar dados inválidos bloqueada');
            return false;
        }
        
        // Cria backup antes de salvar
        serverProtection.createBackup();
        
    fs.writeFileSync(PAINEL_FILE, JSON.stringify(data, null, 2));
        console.log('✅ Dados do painel salvos com sucesso');
        return true;
    } catch (e) {
        console.error('❌ Erro ao salvar dados do painel:', e.message);
        return false;
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // API: GET painel
    if (pathname === '/api/painel' && req.method === 'GET') {
        const data = readPainelData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }
    // API: POST painel
    if (pathname === '/api/painel' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                // VALIDAÇÃO DE SEGURANÇA - Previne ataques
                if (body.length > 10000) { // Limite de 10KB
                    console.warn('🚫 Requisição muito grande bloqueada');
                    res.writeHead(413, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Requisição muito grande' }));
                    return;
                }
                
                const data = JSON.parse(body);
                
                // VALIDAÇÃO DE DADOS - Garante que os dados são válidos
                if (!validatePanelData(data)) {
                    console.warn('🚫 Dados inválidos na requisição POST');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Dados inválidos' }));
                    return;
                }
                
                // Salva dados com proteção
                const saved = savePainelData(data);
                if (!saved) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Erro ao salvar dados' }));
                    return;
                }
                
                // Broadcast para todos os clientes WebSocket
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'update', data }));
                    }
                });
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            } catch (e) {
                console.error('❌ Erro ao processar requisição POST:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Erro ao processar dados' }));
            }
        });
        return;
    }

    // Endpoint para upload local de imagens
    if (pathname === '/api/upload' && req.method === 'POST') {
        // Garante que a pasta existe
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR);
        }
        const form = new IncomingForm({ multiples: false, uploadDir: UPLOAD_DIR, keepExtensions: true });
        form.parse(req, (err, fields, files) => {
            let file = files.image || Object.values(files)[0];
            if (Array.isArray(file)) file = file[0];
            if (Array.isArray(file)) file = file[0];
            if (!file || (!file.filepath && !file.newFilename)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Arquivo não enviado corretamente', file }));
                return;
            }
            const fileName = path.basename(file.newFilename || file.filepath);
            const url = `/uploads/${fileName}`;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ url }));
        });
        return;
    }

    // Servir arquivos da pasta uploads
    if (pathname.startsWith('/uploads/')) {
        const filePath = path.join(UPLOAD_DIR, pathname.replace('/uploads/', ''));
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Arquivo não encontrado');
            } else {
                const extname = path.extname(filePath);
                const contentType = MIME_TYPES[extname] || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
        return;
    }

    // Servir arquivos estáticos
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>The file was not found.</p>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            const extname = path.extname(filePath);
            const contentType = MIME_TYPES[extname] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// WebSocket para atualização em tempo real
const wss = new WebSocket.Server({ server });

// Função para validar mensagens WebSocket
function validateWebSocketMessage(message) {
    try {
        const data = JSON.parse(message);
        
        // Verifica se a mensagem tem estrutura válida
        if (!data.type || !data.data) {
            return false;
        }
        
        // Valida tipos de mensagem permitidos
        const allowedTypes = ['update', 'status', 'notification', 'ping'];
        if (!allowedTypes.includes(data.type)) {
            console.warn('🚫 Tipo de mensagem WebSocket não permitido:', data.type);
            return false;
        }
        
        // Valida dados se for tipo 'update'
        if (data.type === 'update' && !validatePanelData(data.data)) {
            console.warn('🚫 Dados inválidos na mensagem WebSocket');
            return false;
        }
        
        return true;
    } catch (e) {
        console.error('❌ Mensagem WebSocket inválida:', e.message);
        return false;
    }
}

wss.on('connection', ws => {
    console.log('🔗 Nova conexão WebSocket estabelecida');
    
    // Envia os dados atuais ao conectar
    const currentData = readPainelData();
    ws.send(JSON.stringify({ type: 'update', data: currentData }));
    
    // Monitora mensagens recebidas
    ws.on('message', (message) => {
        try {
            const messageStr = message.toString();
            
            // VALIDAÇÃO DE SEGURANÇA - Previne ataques
            if (messageStr.length > 5000) { // Limite de 5KB
                console.warn('🚫 Mensagem WebSocket muito grande bloqueada');
                return;
            }
            
            // Valida mensagem
            if (!validateWebSocketMessage(messageStr)) {
                console.warn('🚫 Mensagem WebSocket inválida bloqueada');
                return;
            }
            
            const data = JSON.parse(messageStr);
            
            // Processa mensagem válida
            if (data.type === 'update') {
                savePainelData(data.data);
                
                // Broadcast para outros clientes
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'update', data: data.data }));
                    }
                });
            }
            
        } catch (e) {
            console.error('❌ Erro ao processar mensagem WebSocket:', e.message);
        }
    });
    
    // Monitora desconexão
    ws.on('close', () => {
        console.log('🔌 Conexão WebSocket fechada');
    });
    
    // Monitora erros
    ws.on('error', (error) => {
        console.error('❌ Erro na conexão WebSocket:', error.message);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor local iniciado com sucesso em http://localhost:${PORT}`);
}); 