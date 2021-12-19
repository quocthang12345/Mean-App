import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector:"app-list-post",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class ListPostComponent implements OnInit,OnDestroy{
  posts: Post[] = []
  isLoading = false

  public userIsAuthenticated = false;

  public userId!: string;

  public totalPage = 0;

  public pageSize = 2;

  public currentPage = 1;

  public pageSizeOptions = [1, 2, 3, 5]

  private authSub = new Subscription();

  private postSub = new Subscription();

  constructor(public postsService: PostService, public authSerivce: AuthService){}

  ngOnInit(){
    this.isLoading = true;
    this.userId = this.authSerivce.getUserId();
    this.postsService.getPosts(this.pageSize, this.currentPage); // gọi api và update post, và tuyên bố thay đổi đến các event lắng nghe
    this.postSub = this.postsService.getUpdatePostListener().subscribe((postData: {posts : Post[], totalPost:number}) => {
      this.isLoading = false;
      this.totalPage = postData.totalPost;
      this.posts = postData.posts;
      this.userId = this.authSerivce.getUserId();
    }) // lắng nghe các thay đổi của event và lấy bản sao cập nhật

    this.userIsAuthenticated = this.authSerivce.getIsAuth();

    this.authSub = this.authSerivce.getAuthListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
      this.userId = this.authSerivce.getUserId();
    });

  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }

  onDeleted(id: String){
    this.isLoading = true;
    console.log("Deleted");
    this.postsService.deletePost(id).subscribe(() => {
        this.postsService.getPosts(this.pageSize,this.currentPage);
    });
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();

    this.authSub.unsubscribe();
  }
}
