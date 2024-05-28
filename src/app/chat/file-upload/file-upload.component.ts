import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FecService } from './file-upload.service';
import { User } from '../../authetification/login/model_user';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../authetification/auth.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  selectedFile: File | null = null;
  public currentUser: User | null = null;

  constructor(private fecService: FecService,
    private authService: AuthService,

    @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.fecService.uploadFile(this.selectedFile,this.currentUser?.userInfo._id!)
        .subscribe((response) => {
          console.log(response); // Handle response from backend (optional)
          this.selectedFile = null; // Clear selection after successful upload
        });
    }
  }
}
