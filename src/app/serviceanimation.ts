import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class AnimationService {
    private animationsEnabled: boolean = true;
  
    constructor() { }
  
    toggleAnimations(enabled: boolean) {
      this.animationsEnabled = enabled;
    }
  
    areAnimationsEnabled(): boolean {
      return this.animationsEnabled;
    }
  }
  