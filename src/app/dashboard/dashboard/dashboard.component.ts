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
    this.loadUsers();
    this.chatService.connectWebSocket(this.loginService.decodedToken.userId);
    this.messagesSubscription = this.chatService.messages$.subscribe(
      (newMessages) => {
        this.conversations = newMessages;
        console.log('Updated messages:', this.conversations);
      }
    );
  }
  selectUser(user: any) {
    this.selectedUser = user;
    this.loadConversations(user.id);
  }

  loadUsers() {
    this.chatService.getUsers().subscribe(data => {
      this.users = data;
      this.selectUser(data.filter((a: any) => a.id != this.loginService.decodedToken.userId)[0])
    });
  }
  loadConversations(userId: number) {
    this.chatService.fetchMessages(userId).subscribe((data: any) => {
      this.conversations = data;
      this.chatService.messages = data;
    })

  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.loginService.decodeToken().userId, this.selectedUser.id, this.message);
    }
    this.message = '';
  }
}