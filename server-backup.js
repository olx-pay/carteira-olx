/**
 * SISTEMA DE BACKUP AUTOMÁTICO - SERVIDOR
 * 
 * Este arquivo implementa proteções no servidor que garantem
 * que os dados críticos sejam preservados e restaurados automaticamente.
 */

const fs = require('fs');
const path = require('path');

class ServerProtection {
    constructor() {
        this.backupDir = path.join(__dirname, '_backups');
        this.criticalFiles = [
            'painel.json',
            'server.js',
            'index.html',
            'carteira.html'
        ];
        this.backupInterval = 5 * 60 * 1000; // 5 minutos
        this.maxBackups = 10;
        this.initProtection();
    }

    // Inicializa o sistema de proteção
    initProtection() {
        console.log('🛡️ Sistema de Proteção do Servidor Ativado');
        
        // Cria diretório de backup se não existir
        this.createBackupDirectory();
        
        // Faz backup inicial
        this.createBackup();
        
        // Agenda backups automáticos
        this.scheduleBackups();
        
        // Protege arquivos críticos
        this.protectCriticalFiles();
        
        // Monitora mudanças
        this.monitorFileChanges();
    }

    // Cria diretório de backup
    createBackupDirectory() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
            console.log('📁 Diretório de backup criado:', this.backupDir);
        }
    }

    // Cria backup dos arquivos críticos
    createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `backup-${timestamp}`);
        
        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, { recursive: true });
        }

        let backupCount = 0;
        this.criticalFiles.forEach(file => {
            const sourcePath = path.join(__dirname, file);
            const destPath = path.join(backupPath, file);
            
            if (fs.existsSync(sourcePath)) {
                try {
                    fs.copyFileSync(sourcePath, destPath);
                    backupCount++;
                } catch (error) {
                    console.error(`❌ Erro ao fazer backup de ${file}:`, error.message);
                }
            }
        });

        console.log(`✅ Backup criado: ${backupCount} arquivos salvos em ${backupPath}`);
        
        // Remove backups antigos
        this.cleanOldBackups();
    }

    // Remove backups antigos
    cleanOldBackups() {
        try {
            const backups = fs.readdirSync(this.backupDir)
                .filter(dir => dir.startsWith('backup-'))
                .map(dir => ({
                    name: dir,
                    path: path.join(this.backupDir, dir),
                    time: fs.statSync(path.join(this.backupDir, dir)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time);

            // Remove backups excedentes
            if (backups.length > this.maxBackups) {
                const toRemove = backups.slice(this.maxBackups);
                toRemove.forEach(backup => {
                    fs.rmSync(backup.path, { recursive: true, force: true });
                    console.log(`🗑️ Backup removido: ${backup.name}`);
                });
            }
        } catch (error) {
            console.error('❌ Erro ao limpar backups antigos:', error.message);
        }
    }

    // Agenda backups automáticos
    scheduleBackups() {
        setInterval(() => {
            this.createBackup();
        }, this.backupInterval);
        
        console.log(`⏰ Backups automáticos agendados a cada ${this.backupInterval / 1000 / 60} minutos`);
    }

    // Protege arquivos críticos
    protectCriticalFiles() {
        this.criticalFiles.forEach(file => {
            const filePath = path.join(__dirname, file);
            this.protectFile(filePath);
        });
    }

    // Protege um arquivo específico
    protectFile(filePath) {
        if (!fs.existsSync(filePath)) return;

        try {
            // Lê o conteúdo original
            const originalContent = fs.readFileSync(filePath, 'utf8');
            
            // Monitora mudanças no arquivo
            fs.watch(filePath, (eventType, filename) => {
                if (eventType === 'change') {
                    console.log(`📝 Arquivo modificado: ${filename}`);
                    
                    // Verifica se a modificação é segura
                    setTimeout(() => {
                        this.validateFileIntegrity(filePath, originalContent);
                    }, 1000);
                }
            });
            
            console.log(`🛡️ Arquivo protegido: ${path.basename(filePath)}`);
        } catch (error) {
            console.error(`❌ Erro ao proteger arquivo ${filePath}:`, error.message);
        }
    }

    // Valida integridade do arquivo
    validateFileIntegrity(filePath, originalContent) {
        try {
            const currentContent = fs.readFileSync(filePath, 'utf8');
            
            // Verifica se o arquivo foi corrompido
            if (this.isFileCorrupted(filePath, currentContent)) {
                console.warn(`⚠️ Arquivo potencialmente corrompido detectado: ${path.basename(filePath)}`);
                this.restoreFile(filePath);
            }
        } catch (error) {
            console.error(`❌ Erro ao validar arquivo ${filePath}:`, error.message);
        }
    }

    // Verifica se o arquivo foi corrompido
    isFileCorrupted(filePath, content) {
        const fileName = path.basename(filePath);
        
        // Verificações específicas por tipo de arquivo
        switch (fileName) {
            case 'painel.json':
                try {
                    JSON.parse(content);
                    return false;
                } catch {
                    return true;
                }
            
            case 'server.js':
                // Verifica se contém funções críticas
                const criticalFunctions = ['readPainelData', 'savePainelData', 'createServer'];
                return !criticalFunctions.every(func => content.includes(func));
            
            case 'index.html':
            case 'carteira.html':
                // Verifica se contém tags HTML essenciais
                return !content.includes('<!DOCTYPE html>') || !content.includes('</html>');
            
            default:
                return false;
        }
    }

    // Restaura arquivo do backup mais recente
    restoreFile(filePath) {
        try {
            const fileName = path.basename(filePath);
            const backups = fs.readdirSync(this.backupDir)
                .filter(dir => dir.startsWith('backup-'))
                .map(dir => ({
                    name: dir,
                    path: path.join(this.backupDir, dir, fileName),
                    time: fs.statSync(path.join(this.backupDir, dir)).mtime.getTime()
                }))
                .filter(backup => fs.existsSync(backup.path))
                .sort((a, b) => b.time - a.time);

            if (backups.length > 0) {
                const latestBackup = backups[0];
                fs.copyFileSync(latestBackup.path, filePath);
                console.log(`✅ Arquivo restaurado: ${fileName} do backup ${latestBackup.name}`);
            } else {
                console.error(`❌ Nenhum backup encontrado para ${fileName}`);
            }
        } catch (error) {
            console.error(`❌ Erro ao restaurar arquivo ${filePath}:`, error.message);
        }
    }

    // Monitora mudanças nos arquivos
    monitorFileChanges() {
        console.log('👀 Monitoramento de arquivos ativado');
        
        // Monitora diretório raiz
        fs.watch(__dirname, (eventType, filename) => {
            if (filename && this.criticalFiles.includes(filename)) {
                console.log(`📊 Mudança detectada em arquivo crítico: ${filename}`);
            }
        });
    }

    // Restaura todos os arquivos do backup mais recente
    restoreAllFiles() {
        console.log('🔄 Iniciando restauração completa...');
        
        const backups = fs.readdirSync(this.backupDir)
            .filter(dir => dir.startsWith('backup-'))
            .map(dir => ({
                name: dir,
                path: path.join(this.backupDir, dir),
                time: fs.statSync(path.join(this.backupDir, dir)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (backups.length === 0) {
            console.error('❌ Nenhum backup encontrado para restauração');
            return false;
        }

        const latestBackup = backups[0];
        let restoredCount = 0;

        this.criticalFiles.forEach(file => {
            const backupPath = path.join(latestBackup.path, file);
            const targetPath = path.join(__dirname, file);
            
            if (fs.existsSync(backupPath)) {
                try {
                    fs.copyFileSync(backupPath, targetPath);
                    restoredCount++;
                    console.log(`✅ Restaurado: ${file}`);
                } catch (error) {
                    console.error(`❌ Erro ao restaurar ${file}:`, error.message);
                }
            }
        });

        console.log(`✅ Restauração concluída: ${restoredCount} arquivos restaurados`);
        return restoredCount > 0;
    }

    // Lista backups disponíveis
    listBackups() {
        try {
            const backups = fs.readdirSync(this.backupDir)
                .filter(dir => dir.startsWith('backup-'))
                .map(dir => ({
                    name: dir,
                    path: path.join(this.backupDir, dir),
                    time: fs.statSync(path.join(this.backupDir, dir)).mtime,
                    files: fs.readdirSync(path.join(this.backupDir, dir))
                }))
                .sort((a, b) => b.time - a.time);

            console.log('📋 Backups disponíveis:');
            backups.forEach((backup, index) => {
                console.log(`${index + 1}. ${backup.name} (${backup.time.toLocaleString()}) - ${backup.files.length} arquivos`);
            });

            return backups;
        } catch (error) {
            console.error('❌ Erro ao listar backups:', error.message);
            return [];
        }
    }

    // Verifica integridade do sistema
    checkSystemIntegrity() {
        console.log('🔍 Verificando integridade do sistema...');
        
        const checks = {
            backupDir: fs.existsSync(this.backupDir),
            criticalFiles: this.criticalFiles.every(file => fs.existsSync(path.join(__dirname, file))),
            serverRunning: process.pid > 0
        };

        const failed = Object.entries(checks).filter(([key, value]) => !value);
        
        if (failed.length > 0) {
            console.error('❌ Falhas de integridade detectadas:', failed.map(([key]) => key));
            return false;
        }

        console.log('✅ Integridade do sistema verificada');
        return true;
    }
}

// Exporta a classe para uso no servidor principal
module.exports = ServerProtection;

// Se executado diretamente, inicializa a proteção
if (require.main === module) {
    const protection = new ServerProtection();
    
    // Comandos via linha de comando
    const command = process.argv[2];
    
    switch (command) {
        case 'backup':
            protection.createBackup();
            break;
        case 'restore':
            protection.restoreAllFiles();
            break;
        case 'list':
            protection.listBackups();
            break;
        case 'check':
            protection.checkSystemIntegrity();
            break;
        default:
            console.log('Comandos disponíveis: backup, restore, list, check');
    }
} 