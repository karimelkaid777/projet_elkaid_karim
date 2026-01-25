import {Component, output, input, signal} from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss'
})
export class ImageUpload {
  currentImageUrl = input<string | null>(null);
  imageSelected = output<string>();

  previewUrl = signal<string | null>(null);
  isDragOver = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private readonly MAX_FILE_SIZE_MB = 10;
  private readonly MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024;
  private readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File) {
    this.errorMessage.set(null);

    if (!this.isValidFileType(file)) {
      this.errorMessage.set(`Type de fichier non supporté. Types acceptés : JPG, PNG, WebP, GIF`);
      return;
    }

    if (!this.isValidFileSize(file)) {
      this.errorMessage.set(`Fichier trop volumineux. Maximum : ${this.MAX_FILE_SIZE_MB} MB`);
      return;
    }

    this.convertFileToBase64(file);
  }

  private isValidFileType(file: File): boolean {
    return this.ALLOWED_FILE_TYPES.includes(file.type);
  }

  private isValidFileSize(file: File): boolean {
    return file.size <= this.MAX_FILE_SIZE_BYTES;
  }

  private convertFileToBase64(file: File) {
    this.isLoading.set(true);

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.previewUrl.set(base64String);
      this.imageSelected.emit(base64String);
      this.isLoading.set(false);
    };

    reader.onerror = () => {
      this.errorMessage.set('Erreur lors de la lecture du fichier');
      this.isLoading.set(false);
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
    this.previewUrl.set(null);
    this.imageSelected.emit('');
  }

  getDisplayImageUrl(): string | null {
    return this.previewUrl() || this.currentImageUrl() || null;
  }

  hasImage(): boolean {
    return !!this.getDisplayImageUrl();
  }
}
