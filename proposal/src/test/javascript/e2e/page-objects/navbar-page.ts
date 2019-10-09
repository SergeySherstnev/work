import { $, ElementFinder } from 'protractor';

import BasePage from './base-component';
import SignInPage from './signin-page';
import RegisterPage from './register-page';
import PasswordPage from './password-page';
import SettingsPage from './settings-page';
import { clickElement } from '../util/utils';

const selector: ElementFinder = $('#app-header');
export default class NavBarPage extends BasePage {
  selector: ElementFinder;
  signInPage: SignInPage;
  adminMenu: ElementFinder = this.selector.$('#admin-menu');
  accountMenu: ElementFinder = this.selector.$('#account-menu');
  entityMenu: ElementFinder = this.selector.$('#entity-menu');

  constructor() {
    super(selector);
    this.selector = selector;
    this.signInPage = new SignInPage();
  }

  async getPasswordPage() {
    await this.clickOnAccountMenuItem('password');
    return new PasswordPage();
  }

  async getSettingsPage() {
    await this.clickOnAccountMenuItem('settings');
    return new SettingsPage();
  }

  async getRegisterPage() {
    await this.clickOnAccountMenu();
    await this.clickOnTabMenu('#register');
    return new RegisterPage();
  }

  async getSignInPage() {
    await this.clickOnAccountMenu();
    await this.clickOnTabMenu('#login');
    return this.signInPage;
  }

  async getEntityPage(entityName: string) {
    await this.clickOnEntityMenu();
    await this.clickOnEntity(entityName);
  }

  async clickOnTabMenu(item: string) {
    await clickElement(this.selector.$('#header-tabs').$(`.dropdown-menu ${item}`));
  }

  async clickOnAccountMenu() {
    await clickElement(this.accountMenu);
  }

  async clickOnAccountMenuItem(item: string) {
    await this.clickOnAccountMenu();
    await clickElement(this.selector.$(`.dropdown-item[href="/account/${item}"`));
  }

  async clickOnAdminMenuItem(item: string) {
    await clickElement(this.adminMenu);
    await clickElement(this.selector.$(`.dropdown-item[href="/admin/${item}"]`));
  }

  async clickOnEntityMenu() {
    await clickElement(this.entityMenu);
  }

  async clickOnEntity(entityName: string) {
    await clickElement(this.selector.$(`.dropdown-item[href="/entity/${entityName}"]`));
  }

  async autoSignIn() {
    await this.signInPage.get();
    await this.signInPage.autoSignInUsing('admin', 'admin');
  }

  async autoSignOut() {
    await this.clickOnAccountMenu();
    await this.clickOnTabMenu('#logout');
  }
}
