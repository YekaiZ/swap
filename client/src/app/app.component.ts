import { Component } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { DBService } from './db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private dialog: MatDialog) { }

  userState = JSON.parse(window.localStorage.getItem('userState')) || false;

  searchBy = 'name';

  menu = [
    {
      name: "Fashion", subMenu: [
        { name: "Male" }, { name: "Female" }
      ]
    },
    {
      name: "Electronics", subMenu: [
        { name: "Camera"}, {name: "Computers"}
      ]
    }
  ]

  openDialog(method: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (method == 'login')
      return this.dialog.open(LoginComponent, dialogConfig);
    return this.dialog.open(RegisterComponent, dialogConfig);
  }

  logout() {
    return window.localStorage.clear();
  }
}
