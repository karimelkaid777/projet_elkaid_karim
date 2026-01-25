import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { CreateUserDto } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  private userService = inject(UserService);
  private router = inject(Router);

  nom = signal('');
  prenom = signal('');
  login = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  validationErrors = signal<{[key: string]: string}>({});
  touchedFields = signal<{[key: string]: boolean}>({});
  success = signal(false);

  // Règles de validation - EXACTEMENT comme le backend
  private readonly validationRules = {
    nom: {
      required: true,
      minLength: 1,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
      message: "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets"
    },
    prenom: {
      required: true,
      minLength: 1,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
      message: "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets"
    },
    login: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[A-Za-z0-9._-]+$/,
      message: "Le login ne peut contenir que des lettres, chiffres, points, underscores et tirets"
    },
    email: {
      required: true,
      maxLength: 255,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Format d'email invalide"
    },
    pass: {
      required: true,
      minLength: 8,
      maxLength: 100,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
    }
  };

  /**
   * Valider un champ selon les règles du backend
   */
  private validateField(fieldName: string, value: string): string | null {
    const rules = this.validationRules[fieldName as keyof typeof this.validationRules];
    if (!rules) return null;

    const trimmedValue = value.trim();

    // Requis
    if (rules.required && !trimmedValue) {
      return `Le ${fieldName} est obligatoire`;
    }

    // Min length
    if ('minLength' in rules && trimmedValue.length < rules.minLength) {
      return `Minimum ${rules.minLength} caractères requis`;
    }

    // Max length
    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      return `Maximum ${rules.maxLength} caractères autorisés`;
    }

    // Pattern
    if (rules.pattern && !rules.pattern.test(trimmedValue)) {
      return rules.message;
    }

    return null;
  }

  /**
   * Valider un champ et mettre à jour les erreurs
   */
  validateFieldAndUpdate(fieldName: string, value: string) {
    const error = this.validateField(fieldName, value);
    const currentErrors = {...this.validationErrors()};

    if (error) {
      currentErrors[fieldName] = error;
    } else {
      delete currentErrors[fieldName];
    }

    this.validationErrors.set(currentErrors);
  }

  /**
   * Marquer un champ comme touché
   */
  markFieldAsTouched(fieldName: string) {
    const touched = {...this.touchedFields()};
    touched[fieldName] = true;
    this.touchedFields.set(touched);
  }

  /**
   * Vérifier si un champ a été touché
   */
  isFieldTouched(fieldName: string): boolean {
    return this.touchedFields()[fieldName] || false;
  }

  /**
   * Gestionnaires onBlur - validation quand l'utilisateur quitte le champ
   */
  onNomBlur() {
    this.markFieldAsTouched('nom');
    this.validateFieldAndUpdate('nom', this.nom());
  }

  onPrenomBlur() {
    this.markFieldAsTouched('prenom');
    this.validateFieldAndUpdate('prenom', this.prenom());
  }

  onLoginBlur() {
    this.markFieldAsTouched('login');
    this.validateFieldAndUpdate('login', this.login());
  }

  onEmailBlur() {
    this.markFieldAsTouched('email');
    this.validateFieldAndUpdate('email', this.email());
  }

  onPasswordBlur() {
    this.markFieldAsTouched('pass');
    this.validateFieldAndUpdate('pass', this.password());
  }

  onConfirmPasswordBlur() {
    this.markFieldAsTouched('confirmPassword');

    // Vérifier si les mots de passe correspondent
    if (this.password() && this.confirmPassword() && this.password() !== this.confirmPassword()) {
      const currentErrors = {...this.validationErrors()};
      currentErrors['confirmPassword'] = 'Les mots de passe ne correspondent pas';
      this.validationErrors.set(currentErrors);
    } else {
      // Supprimer l'erreur si les mots de passe correspondent
      const currentErrors = {...this.validationErrors()};
      delete currentErrors['confirmPassword'];
      this.validationErrors.set(currentErrors);
    }
  }

  onSubmit() {
    // Marquer tous les champs comme touchés
    this.markFieldAsTouched('nom');
    this.markFieldAsTouched('prenom');
    this.markFieldAsTouched('login');
    this.markFieldAsTouched('email');
    this.markFieldAsTouched('pass');
    this.markFieldAsTouched('confirmPassword');

    // Valider tous les champs avant soumission
    this.validateFieldAndUpdate('nom', this.nom());
    this.validateFieldAndUpdate('prenom', this.prenom());
    this.validateFieldAndUpdate('login', this.login());
    this.validateFieldAndUpdate('email', this.email());
    this.validateFieldAndUpdate('pass', this.password());

    // Valider la correspondance des mots de passe
    if (this.password() !== this.confirmPassword()) {
      const currentErrors = {...this.validationErrors()};
      currentErrors['confirmPassword'] = 'Les mots de passe ne correspondent pas';
      this.validationErrors.set(currentErrors);
    }

    // Vérifier s'il y a des erreurs
    if (Object.keys(this.validationErrors()).length > 0) {
      this.error.set('Veuillez corriger les erreurs avant de continuer');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const userDto: CreateUserDto = {
      nom: this.nom(),
      prenom: this.prenom(),
      login: this.login(),
      email: this.email(),
      pass: this.password()
    };

    this.userService.createUser(userDto).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.success.set(true);
        alert(`Compte créé avec succès pour ${user.nom}!`);
        setTimeout(() => {
          this.router.navigate(['/users/login']);
        }, 1000);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error details:', err);

        // Gérer les erreurs de validation Zod
        if (err.error?.type === 'Body' && err.error?.errors?.issues) {
          const errors: {[key: string]: string} = {};
          err.error.errors.issues.forEach((issue: any) => {
            const field = issue.path[0]; // Nom du champ (ex: 'pass', 'login', etc.)
            errors[field] = issue.message; // Message d'erreur
          });
          this.validationErrors.set(errors);
          this.error.set('Veuillez corriger les erreurs de validation ci-dessous');
        } else if (err.error?.message) {
          // Autre type d'erreur avec message
          this.error.set(err.error.message);
          this.validationErrors.set({});
        } else {
          // Erreur générique
          this.error.set('Erreur lors de la création du compte');
          this.validationErrors.set({});
        }
      }
    });
  }
}
