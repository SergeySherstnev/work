import Component from 'vue-class-component';
import { Inject, Vue } from 'vue-property-decorator';
import LoginService from '@/account/login.service';
import AccountService from '@/account/account.service';

@Component
export default class Home extends Vue {
  @Inject('loginService') private loginService: () => LoginService;
  @Inject('accountService') private accountService: () => AccountService;

  private hipsterPic = '../../../content/images/jhipster_family_member_' + this.randomNum() + '.svg';

  public openLogin(): void {
    this.loginService().openLogin((<any>this).$root);
  }

  public get authenticated(): boolean {
    return this.$store.getters.authenticated;
  }

  public hasAnyAuthority(authorities: any): boolean {
    return this.accountService().hasAnyAuthority(authorities);
  }

  public get username(): string {
    return this.$store.getters.account ? this.$store.getters.account.login : '';
  }

  public get userId(): string {
    return this.$store.getters.account ? this.$store.getters.account.id : '';
  }

  private randomNum(): number {
    return Math.floor(Math.random() * 4) + 0;
  }

  public randomizeHipster(): void {
    this.hipsterPic = '../../../content/images/jhipster_family_member_' + this.randomNum() + '.svg';
  }

  public get hipsterPicture(): string {
    return this.hipsterPic;
  }
}
