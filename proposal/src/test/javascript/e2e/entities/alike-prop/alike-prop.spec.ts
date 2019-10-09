/* tslint:disable no-unused-expression */
import { browser, protractor, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import AlikeComponentsPage from './alike-prop.page-object';
import { AlikeDeleteDialog } from './alike-prop.page-object';
import AlikeUpdatePage from './alike-prop-update.page-object';
import AlikeDetailsPage from './alike-prop-details.page-object';
import {
  waitUntilDisplayed,
  waitUntilHidden,
  getDangerToast,
  getInfoToast,
  getSuccessToast,
  waitSilentlyUntilDisplayed
} from '../../util/utils';

const expect = chai.expect;

describe('Alike e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let alikeUpdatePage: AlikeUpdatePage;
  let alikeDetailsPage: AlikeDetailsPage;
  let alikeComponentsPage: AlikeComponentsPage;
  /*let alikeDeleteDialog: AlikeDeleteDialog;*/
  let nbButtonsBeforeCreate = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
  });

  it('should load Alikes', async () => {
    await navBarPage.getEntityPage('alike-prop');
    alikeComponentsPage = new AlikeComponentsPage();

    await waitSilentlyUntilDisplayed(alikeComponentsPage.getDeleteButtons().last());
    const heading = alikeComponentsPage.getTitle();
    await waitUntilDisplayed(heading);

    const footer = alikeComponentsPage.getFooter();
    await waitUntilDisplayed(footer);

    expect(await heading.getText()).not.to.be.empty;
    nbButtonsBeforeCreate = await alikeComponentsPage.countAlike();
  });

  it('should load create Alike page', async () => {
    await alikeComponentsPage.clickOnCreateButton();
    alikeUpdatePage = new AlikeUpdatePage();

    const heading = alikeUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = alikeUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(alikeUpdatePage.getSaveButton());

    expect(await heading.getAttribute('id')).to.match(/proposalApp.alike.home.createOrEditLabel/);
  });

  /* it('should create and save Alikes', async () => {

    await alikeUpdatePage.setTextInput('text');
    expect(await alikeUpdatePage.getTextInput()).to.match(/text/);


    await alikeUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await alikeUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');

    // await alikeUpdatePage.authorSelectLastOption();
    // await alikeUpdatePage.proposalSelectLastOption();

    await alikeUpdatePage.save();
    await waitUntilHidden(alikeUpdatePage.getSaveButton());
    expect(await alikeUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getSuccessToast();
    await waitUntilDisplayed(toast);
    // Success toast should appear
    expect(await toast.isPresent()).to.be.true;

    await alikeComponentsPage.waitUntilAlikeCountIs(nbButtonsBeforeCreate + 1);
    expect(await alikeComponentsPage.countAlike()).to.eq(nbButtonsBeforeCreate + 1);
  });*/

  it('should load details Alike page and fetch data', async () => {
    await alikeComponentsPage.waitUntilLoaded();
    await alikeComponentsPage.clickOnLastDetailsButton();
    alikeDetailsPage = new AlikeDetailsPage();

    const heading = alikeDetailsPage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = alikeUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(await alikeDetailsPage.getBackButton());
    expect(await heading.getText()).not.to.be.empty;

    const firstDetail = alikeDetailsPage.getFirstDetail();
    expect(await firstDetail.getText()).not.to.be.empty;

    await alikeDetailsPage.getBackButton().click();
    await alikeComponentsPage.waitUntilAlikeCountIs(nbButtonsBeforeCreate + 1);
  });

  it('should load edit Alike page and fetch data', async () => {
    await alikeComponentsPage.waitUntilLoaded();
    await alikeComponentsPage.clickOnLastEditButton();
    const heading = alikeUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = alikeUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(alikeUpdatePage.getSaveButton());

    expect(await heading.getText()).not.to.be.empty;

    await alikeUpdatePage.clearTextInput();
    await alikeUpdatePage.setTextInput('modified');
    expect(await alikeUpdatePage.getTextInput()).to.match(/modified/);

    await alikeUpdatePage.clearCreatedDateInput();
    await alikeUpdatePage.setCreatedDateInput('01/01/2019' + protractor.Key.TAB + '02:30AM');
    expect(await alikeUpdatePage.getCreatedDateInput()).to.contain('2019-01-01T02:30');

    await alikeUpdatePage.save();

    await waitUntilHidden(alikeUpdatePage.getSaveButton());

    expect(await alikeUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getInfoToast();
    await waitUntilDisplayed(toast);
    // Info toast should appear
    expect(await toast.isPresent()).to.be.true;
  });

  /* it('should delete last Alike', async () => {
    await alikeComponentsPage.waitUntilLoaded();
    const nbAlikeBeforeDelete = await alikeComponentsPage.countAlike();
    await alikeComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);
    alikeDeleteDialog = new AlikeDeleteDialog();
    expect(await alikeDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/proposalApp.alike.delete.question/);

    await alikeDeleteDialog.clickOnConfirmButton();
    await waitUntilHidden(deleteModal);

    // Delete modal should disappear
    expect(await deleteModal.isDisplayed()).to.be.false;

    const toast = getDangerToast();

    // Danger toast should appear
    expect(await toast.isPresent()).to.be.true;

    expect(await alikeComponentsPage.countAlike()).to.eq(nbAlikeBeforeDelete - 1);

  });*/

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
