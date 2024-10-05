import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { LoginService } from '../../services/login-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewChecked {
  users: any[] = [];
  conversations: any[] = [];
  selectedUser: any;
  message: string = '';

  constructor(private chatService: MessageService, public loginService: LoginService, private toastr: ToastrService,) { }
  @ViewChild('messagesContainer') public messagesContainer!: ElementRef;
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      console.log(container.scrollHeight, container.scrollTop, container.clientHeight)
      if (container.scrollHeight - container.scrollTop === container.clientHeight) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }
  public userId!: number;
  messagesSubscription: any;
  ngOnInit() {
    this.loadUsers().then((data: any) => {
      // this.selectUser(data.filter((a: any) => a.id != this.loginService.decodedToken.userId)[0])
    });
    this.chatService.connectWebSocket(this.loginService.decodedToken.userId);
    this.messagesSubscription = this.chatService.messages$.subscribe(
      (newMessages) => {
        this.conversations = newMessages;
        console.log('Updated messages:', this.conversations);
      }
    );
  }
  selectedUserConversation = [];
  selectUser(user: any) {
    this.selectedUser = user;
    this.loadConversations(user.id);
  }

  loadUsers() {
    return new Promise((resolve, reject) => {
      this.chatService.getUsers().subscribe(data => {
        this.users = data;
        resolve(data)
      });
    })
  }

  loadConversations(userId: number) {
    this.chatService.fetchMessages(userId).subscribe((data: any) => {
      this.conversations = data.filter((x: any) => x.sender_id == this.loginService.decodedToken.userId && x.receiver_id == userId || x.sender_id == userId && x.receiver_id == this.loginService.decodedToken.userId);
      this.chatService.messages = data.filter((x: any) => x.sender_id == this.loginService.decodedToken.userId && x.receiver_id == userId || x.sender_id == userId && x.receiver_id == this.loginService.decodedToken.userId);
    })

  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.loginService.decodeToken().userId, this.selectedUser.id, this.message);
    }
    this.message = '';
    this.loadConversations(this.selectedUser.id)
  }
}