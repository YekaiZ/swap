import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DBService } from '../db.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-match-listing',
  templateUrl: './match-listing.component.html',
  styleUrls: ['./match-listing.component.css']
})
export class MatchListingComponent implements OnInit {

  constructor(private cookieSvc: CookieService, private dbSvc: DBService, private router: Router, private _snackBar: MatSnackBar) { }

  user;
  fullListings;
  userListings;
  pageCount = [];
  pageNum = 0;

  ngOnInit() {
    this.user = JSON.parse(this.cookieSvc.get('userDetail'))
    this.getListing();
  }

  getListing() {
    this.dbSvc.getUserListing(this.user.email).then(result => {
      this.fullListings = result;
      if (this.fullListings == 0) {
        return this.userListings = null;
      }
      if (result) {
        this.pageCount = Array(Math.ceil(this.fullListings.length / 5)).fill(0).map((x, i) => i);
        this.pagination(this.pageNum);
        console.log(this.fullListings)
      }
    })
      .catch(err => {
        console.log(err)
      })
  }

  delete(listing) {
    this.dbSvc.deleteListing(listing._id)
      .then(result => {
        this.getListing()
        this._snackBar.open('Listing deleted', 'dismiss', {
          duration: 3000,
        });
      })
      .catch(err => {
        this._snackBar.open('Delete failed, please relogin.', 'dismiss', {
          duration: 3000,
        });
      })
  }

  match(listing) {
    this.router.navigate(['/matched-listings', listing._id]);
  }

  pagination(pageNum) {
    this.pageNum = pageNum
    const start = pageNum * 5 || 0
    this.userListings = this.fullListings.slice(start, (start + 5))
    for (let i = 0; i < this.userListings.length; i++) {
      if (this.userListings[i].listingImages) {
        this.userListings[i].images = []
        for (let b = 0; b < this.userListings[i].listingImages.length; b++) {
          this.userListings[i].images.push({
            image: this.userListings[i].listingImages[b],
            thumbImage: this.userListings[i].listingImages[b],
          })
        }
      }
    }
    return this.userListings
  }

  left() {
    if (this.pageNum == 0) {
      return this._snackBar.open('You have reached the first page.', 'dismiss', {
        duration: 3000,
      });
    }
    this.pageNum--;
    this.pagination(this.pageNum);
  }

  right() {
    if (this.pageNum == (this.pageCount.length - 1)) {
      return this._snackBar.open('You have reached the last page.', 'dismiss', {
        duration: 3000,
      });
    }
    this.pageNum++;
    this.pagination(this.pageNum);
  }

  navigate(id) {
    this.router.navigate(['listing', id]);
  }

}
