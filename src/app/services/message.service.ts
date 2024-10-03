import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:3000/api';

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  private ws!: WebSocket;
  public messages: any[] = [];
  public messages$ = new Subject<any[]>();

  constructor(private http: HttpClient) {
  }

  public connectWebSocket(userId: string) {
    this.ws = new WebSocket(`ws://localhost:3000/?userId=${userId}`);

    this.ws.onmessage = (event) => {
      console.log(event)
      const newMessage = JSON.parse(event.data);
      console.log('Received message:', newMessage);
      this.messages = [...this.messages, ...[newMessage]]
      this.messages$.next(this.messages);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  sendMessage(senderId: number, receiverId: number, message: string) {
    this.ws.send(JSON.stringify({ senderId, receiverId, message }));
    // return this.http.post(`${this.apiUrl}/conversations`, { senderId, receiverId, message }, { observe: 'response' });
  }

  fetchMessages(userId: number) {
    return this.http.get(`${this.apiUrl}/conversations/${userId}`);
  }
}
