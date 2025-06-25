/**
 * SCRIPT DE INICIALIZAÇÃO PROTEGIDA
 * 
 * Este script garante que o sistema seja iniciado com todas as proteções ativas.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando Sistema OLX com Proteção Completa...\n');

// Verifica se todos os arquivos de proteção existem
const requiredFiles = [
    'protection.js',
    'server-backup.js',
    'server.js',
    'index.html',
    'carteira.html',
    'painel.json'
];

console.log('📋 Verificando arquivos necessários...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - ARQUIVO FALTANDO!`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.error('\n❌ ERRO: Alguns arquivos necessários estão faltando!');
    console.error('Por favor, verifique se todos os arquivos estão presentes.');
    process.exit(1);
}

console.log('\n✅ Todos os arquivos necessários encontrados!');

// Verifica integridade do painel.json
console.log('\n🔍 Verificando integridade dos dados...');
try {
    const painelData = JSON.parse(fs.readFileSync('painel.json', 'utf8'));
    const requiredFields = ['saldoDisponivel', 'saldoReceber', 'taxaPagar', 'ligado'];
    const missingFields = requiredFields.filter(field => !(field in painelData));
    
    if (missingFields.length > 0) {
        console.log(`⚠️ Campos faltando no painel.json: ${missingFields.join(', ')}`);
        console.log('🔄 Restaurando dados padrão...');
        
        const defaultData = {
            saldoDisponivel: 1250.00,
            saldoReceber: 0,
            taxaPagar: 0,
            nomeMotorista: '',
            placaCarro: '',
            modeloMotorista: '',
            ligado: false
        };
        
        fs.writeFileSync('painel.json', JSON.stringify(defaultData, null, 2));
        console.log('✅ Dados do painel restaurados!');
    } else {
        console.log('✅ Dados do painel estão íntegros!');
    }
} catch (error) {
    console.error('❌ Erro ao verificar dados do painel:', error.message);
    console.log('🔄 Restaurando dados padrão...');
    
    const defaultData = {
        saldoDisponivel: 1250.00,
        saldoReceber: 0,
        taxaPagar: 0,
        nomeMotorista: '',
        placaCarro: '',
        modeloMotorista: '',
        ligado: false
    };
    
    fs.writeFileSync('painel.json', JSON.stringify(defaultData, null, 2));
    console.log('✅ Dados do painel restaurados!');
}

// Inicializa o sistema de proteção
console.log('\n🛡️ Inicializando sistema de proteção...');
try {
    const ServerProtection = require('./server-backup');
    const serverProtection = new ServerProtection();
    console.log('✅ Sistema de proteção ativado!');
} catch (error) {
    console.error('❌ Erro ao inicializar proteção:', error.message);
    process.exit(1);
}

// Inicia o servidor
console.log('\n🌐 Iniciando servidor...');
try {
    const server = require('./server.js');
    console.log('✅ Servidor iniciado com sucesso!');
} catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1);
}

console.log('\n🎉 SISTEMA INICIADO COM SUCESSO!');
console.log('📊 Status: TODAS AS PROTEÇÕES ATIVAS');
console.log('🌐 Servidor: http://localhost:8080');
console.log('🛡️ Proteção: 100% ATIVA');
console.log('💾 Backup: AUTOMÁTICO');
console.log('🔍 Monitoramento: ATIVO');

console.log('\n📋 Informações importantes:');
console.log('- O sistema está 100% protegido contra quebras');
console.log('- Backups automáticos a cada 5 minutos');
console.log('- Restauração automática em caso de problemas');
console.log('- Monitoramento contínuo de integridade');
console.log('- Logs detalhados para análise');

console.log('\n🚀 Para acessar o sistema:');
console.log('1. Abra http://localhost:8080 no navegador');
console.log('2. Use qualquer e-mail para fazer login');
console.log('3. Acesse a carteira digital');
console.log('4. Todas as funcionalidades estão protegidas!');

console.log('\n🛠️ Comandos úteis:');
console.log('- node server-backup.js backup    # Backup manual');
console.log('- node server-backup.js restore   # Restaurar arquivos');
console.log('- node server-backup.js list      # Listar backups');
console.log('- node server-backup.js check     # Verificar integridade');

console.log('\n✅ Sistema pronto para uso! 🚀'); 