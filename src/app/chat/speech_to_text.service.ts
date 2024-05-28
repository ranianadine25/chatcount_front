import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpeechToTextService {
  private apiKey = 'YOUR_GOOGLE_CLOUD_API_KEY';
  private apiUrl = 'https://speech.googleapis.com/v1/speech:recognize?key=' + this.apiKey;

  constructor(private http: HttpClient) { }

  convertAudioToText(audioFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioFile);

    return this.http.post<any>(this.apiUrl, formData).toPromise()
      .then(response => {
        if (response.results && response.results.length > 0) {
          return response.results[0].alternatives[0].transcript;
        } else {
          return 'No speech detected';
        }
      })
      .catch(error => {
        console.error('Error converting audio to text:', error);
        return 'Error converting audio to text';
      });
  }
}
