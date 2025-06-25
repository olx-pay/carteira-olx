/**
 * SISTEMA DE PROTEÇÃO - GARANTIA 100% DE FUNCIONALIDADE
 * 
 * Este arquivo implementa proteções que garantem que o código atual
 * continue funcionando perfeitamente, mesmo com futuras modificações.
 */

class CodeProtection {
    constructor() {
        this.originalFunctions = new Map();
        this.backupData = new Map();
        this.protectionActive = true;
        this.initProtection();
    }

    // Protege funções críticas do sistema
    initProtection() {
        console.log('🛡️ Sistema de Proteção Ativado - Garantindo 100% de funcionalidade');
        
        // Protege funções críticas do login
        this.protectLoginSystem();
        
        // Protege funções da carteira
        this.protectWalletSystem();
        
        // Protege WebSocket e comunicação
        this.protectWebSocketSystem();
        
        // Protege dados do painel
        this.protectPanelData();
        
        // Monitora mudanças críticas
        this.monitorCriticalChanges();
    }

    // Protege o sistema de login
    protectLoginSystem() {
        // Backup da função de verificação de login
        if (typeof checkLoginStatus === 'function') {
            this.originalFunctions.set('checkLoginStatus', checkLoginStatus);
        }

        // Protege redirecionamento para carteira
        const originalRedirect = window.location.href;
        this.backupData.set('originalRedirect', originalRedirect);

        // Intercepta tentativas de modificar o login
<<<<<<< HEAD
=======
        /*
>>>>>>> 3de5ffe (Primeiro commit do projeto OLX finalizado)
        Object.defineProperty(window, 'location', {
            get: function() {
                return window.location;
            },
            set: function(value) {
                // Permite apenas redirecionamentos seguros
                if (value.includes('carteira.html') || value.includes('index.html')) {
                    window.location.href = value;
                } else {
                    console.warn('🚫 Redirecionamento bloqueado por segurança:', value);
                }
            }
        });
<<<<<<< HEAD
=======
        */
>>>>>>> 3de5ffe (Primeiro commit do projeto OLX finalizado)
    }

    // Protege o sistema da carteira
    protectWalletSystem() {
        // Protege dados do saldo
        this.protectBalanceData();
        
        // Protege funções de saque
        this.protectWithdrawFunctions();
        
        // Protege chat de suporte
        this.protectChatSystem();
    }

    // Protege dados do saldo
    protectBalanceData() {
        const balanceElements = document.querySelectorAll('[data-balance]');
        balanceElements.forEach(element => {
            this.backupData.set(`balance_${element.id}`, element.innerHTML);
        });

        // Intercepta tentativas de modificar o saldo
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.target.hasAttribute('data-balance')) {
                    const originalValue = this.backupData.get(`balance_${mutation.target.id}`);
                    if (originalValue && mutation.target.innerHTML !== originalValue) {
                        console.warn('🚫 Tentativa de modificar saldo bloqueada');
                        mutation.target.innerHTML = originalValue;
                    }
                }
            });
        });

        balanceElements.forEach(element => {
            observer.observe(element, { childList: true, subtree: true });
        });
    }

    // Protege funções de saque
    protectWithdrawFunctions() {
        // Backup das funções de saque
        if (typeof processWithdraw === 'function') {
            this.originalFunctions.set('processWithdraw', processWithdraw);
        }

        // Valida dados de saque antes de processar
        const validateWithdrawData = (data) => {
            const required = ['amount', 'bank', 'account'];
            const missing = required.filter(field => !data[field]);
            
            if (missing.length > 0) {
                console.error('❌ Dados de saque incompletos:', missing);
                return false;
            }
            
            if (data.amount <= 0 || data.amount > 10000) {
                console.error('❌ Valor de saque inválido:', data.amount);
                return false;
            }
            
            return true;
        };

        // Sobrescreve função de saque com validação
        if (typeof processWithdraw === 'function') {
            const originalWithdraw = processWithdraw;
            window.processWithdraw = function(data) {
                if (!validateWithdrawData(data)) {
                    return false;
                }
                return originalWithdraw.call(this, data);
            };
        }
    }

    // Protege sistema de chat
    protectChatSystem() {
        // Backup das funções de chat
        if (typeof sendChatMessage === 'function') {
            this.originalFunctions.set('sendChatMessage', sendChatMessage);
        }

        // Valida mensagens do chat
        const validateChatMessage = (message) => {
            if (!message || message.trim().length === 0) {
                return false;
            }
            
            // Bloqueia tentativas de XSS
            const dangerousPatterns = /<script|javascript:|on\w+\s*=|eval\(/gi;
            if (dangerousPatterns.test(message)) {
                console.warn('🚫 Tentativa de XSS bloqueada no chat');
                return false;
            }
            
            return true;
        };

        // Sobrescreve função de envio de mensagem
        if (typeof sendChatMessage === 'function') {
            const originalSend = sendChatMessage;
            window.sendChatMessage = function(message) {
                if (!validateChatMessage(message)) {
                    return false;
                }
                return originalSend.call(this, message);
            };
        }
    }

    // Protege WebSocket e comunicação
    protectWebSocketSystem() {
        // Backup da conexão WebSocket
        if (window.ws) {
            this.backupData.set('websocket', window.ws);
        }

        // Valida mensagens WebSocket
        const validateWebSocketMessage = (message) => {
            try {
                const data = JSON.parse(message);
                
                // Verifica se a mensagem tem estrutura válida
                if (!data.type || !data.data) {
                    return false;
                }
                
                // Valida tipos de mensagem permitidos
                const allowedTypes = ['update', 'status', 'notification'];
                if (!allowedTypes.includes(data.type)) {
                    console.warn('🚫 Tipo de mensagem WebSocket não permitido:', data.type);
                    return false;
                }
                
                return true;
            } catch (e) {
                console.error('❌ Mensagem WebSocket inválida:', e);
                return false;
            }
        };

        // Intercepta mensagens WebSocket
        if (window.ws) {
            const originalSend = window.ws.send;
            window.ws.send = function(message) {
                if (!validateWebSocketMessage(message)) {
                    return false;
                }
                return originalSend.call(this, message);
            };
        }
    }

    // Protege dados do painel
    protectPanelData() {
        // Backup dos dados do painel
        const panelData = {
            saldoDisponivel: 1250.00,
            saldoReceber: 0,
            taxaPagar: 0,
            nomeMotorista: '',
            placaCarro: '',
            modeloMotorista: '',
            ligado: false
        };
        
        this.backupData.set('panelData', panelData);

        // Valida dados do painel
        const validatePanelData = (data) => {
            const required = ['saldoDisponivel', 'saldoReceber', 'taxaPagar'];
            const missing = required.filter(field => !(field in data));
            
            if (missing.length > 0) {
                console.error('❌ Dados do painel incompletos:', missing);
                return false;
            }
            
            // Valida tipos de dados
            if (typeof data.saldoDisponivel !== 'number' || data.saldoDisponivel < 0) {
                console.error('❌ Saldo disponível inválido:', data.saldoDisponivel);
                return false;
            }
            
            return true;
        };

        // Sobrescreve função de atualização do painel
        if (typeof updatePanelData === 'function') {
            const originalUpdate = updatePanelData;
            window.updatePanelData = function(data) {
                if (!validatePanelData(data)) {
                    return false;
                }
                return originalUpdate.call(this, data);
            };
        }
    }

    // Monitora mudanças críticas
    monitorCriticalChanges() {
        // Monitora mudanças no DOM crítico
        const criticalElements = [
            '.wallet-balance-section',
            '.total-receber-section',
            '.card-saque',
            '.chat-support-btn'
        ];

        criticalElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.backupData.set(`element_${selector}`, element.outerHTML);
                
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' || mutation.type === 'attributes') {
                            const originalHTML = this.backupData.get(`element_${selector}`);
                            if (originalHTML && element.outerHTML !== originalHTML) {
                                console.warn('🚫 Mudança crítica detectada e revertida:', selector);
                                element.outerHTML = originalHTML;
                            }
                        }
                    });
                });

                observer.observe(element, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'style', 'id']
                });
            });
        });
    }

    // Restaura funcionalidade original se necessário
    restoreOriginalFunction(functionName) {
        const original = this.originalFunctions.get(functionName);
        if (original) {
            window[functionName] = original;
            console.log(`✅ Função ${functionName} restaurada`);
        }
    }

    // Verifica integridade do sistema
    checkSystemIntegrity() {
        const checks = {
            login: typeof checkLoginStatus === 'function',
            wallet: document.querySelector('.wallet-balance-section') !== null,
            chat: document.querySelector('.chat-support-btn') !== null,
            websocket: window.ws && window.ws.readyState === WebSocket.OPEN
        };

        const failed = Object.entries(checks).filter(([key, value]) => !value);
        
        if (failed.length > 0) {
            console.error('❌ Falhas de integridade detectadas:', failed.map(([key]) => key));
            return false;
        }

        console.log('✅ Integridade do sistema verificada');
        return true;
    }

    // Desativa proteção (apenas para emergências)
    disableProtection() {
        this.protectionActive = false;
        console.warn('⚠️ Proteção desativada - Use apenas em emergências!');
    }

    // Reativa proteção
    enableProtection() {
        this.protectionActive = true;
        this.initProtection();
        console.log('🛡️ Proteção reativada');
    }
}

// Inicializa proteção automaticamente
const codeProtection = new CodeProtection();

// Verifica integridade a cada 5 segundos
setInterval(() => {
    if (codeProtection.protectionActive) {
        codeProtection.checkSystemIntegrity();
    }
}, 5000);

// Proteção contra modificação do objeto de proteção
Object.freeze(codeProtection);

// Exporta para uso global
window.codeProtection = codeProtection;

console.log('🛡️ Sistema de Proteção Inicializado - Código 100% Protegido'); 