class AuthUI {
    constructor() {
        this.isRegister = false;
        this.isLoading = false;
        
        // Elements
        this.form = document.getElementById('authForm');
        this.formTitle = document.getElementById('formTitle');
        this.formDescription = document.getElementById('formDescription');
        this.submitButton = document.getElementById('submitButton');
        this.toggleButton = document.getElementById('toggleAuth');
        this.buttonText = this.submitButton.querySelector('.button-text');
        this.loader = this.submitButton.querySelector('.loader');
        
        // Bind events
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.toggleButton.addEventListener('click', this.toggleAuthMode.bind(this));
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.submitButton.disabled = loading;
        this.buttonText.classList.toggle('hidden', loading);
        this.loader.classList.toggle('hidden', !loading);
    }

    updateUIText() {
        if (this.isRegister) {
            this.formTitle.textContent = 'Hesap Oluştur';
            this.formDescription.textContent = 'Yeni bir hesap oluşturmak için bilgilerinizi girin';
            this.buttonText.textContent = 'Kayıt Ol';
            this.toggleButton.textContent = 'Zaten hesabınız var mı? Giriş yapın';
        } else {
            this.formTitle.textContent = 'Hoş Geldiniz';
            this.formDescription.textContent = 'Hesabınıza giriş yapmak için bilgilerinizi girin';
            this.buttonText.textContent = 'Giriş Yap';
            this.toggleButton.textContent = 'Hesabınız yok mu? Kayıt olun';
        }
    }

    toggleAuthMode() {
        this.isRegister = !this.isRegister;
        this.updateUIText();
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (this.isLoading) return;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        this.setLoading(true);

        try {
            const response = await fetch(`/api/auth/${this.isRegister ? 'register' : 'login'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Bir hata oluştu');
            }

            this.showToast(
                this.isRegister 
                    ? 'Kayıt başarılı! Giriş yapabilirsiniz.' 
                    : 'Giriş başarılı!'
            );

            if (this.isRegister) {
                this.toggleAuthMode();
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setLoading(false);
        }
    }
}

// Initialize the auth UI
new AuthUI();