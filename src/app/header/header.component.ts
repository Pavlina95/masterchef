import { Component, Output, EventEmitter, HostListener } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '(window:scroll)': 'onScroll($event)'
  }
})
export class HeaderComponent {
  subscription: Subscription;
  isUserAuthenticated: boolean;
  isScrolled = false;
  currPos: Number = 0;
  startPos: Number = 0;
  changePos: Number = 100;
  @Output() getSigninModalStateChange = new EventEmitter<boolean>();
  @Output() getSignupModalStateChange = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isUserAuthenticated = this.authService.checkIfUserIsAuthenticated();
    this.subscription = this.authService.userAuthenticationChanged.subscribe(
      (isUserAuthenticated: boolean) => {
        this.isUserAuthenticated = isUserAuthenticated;
      }
    );
  }

  onLogout() {
    sessionStorage.removeItem('jwtToken');
    this.authService.setIsUserAuthenticated(false);
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openSignupModal() {
    this.getSignupModalStateChange.emit(true);
  }

  openSigninModal() {
    this.getSigninModalStateChange.emit(true);
  }

  //window object can be wrapper in a service but for now we directly use it
  onScroll(evt) {
    this.currPos =
      (window.pageYOffset || evt.target.scrollTop) -
      (evt.target.clientTop || 0);
    if (this.currPos >= this.changePos) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }
}
