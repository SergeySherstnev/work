/* tslint:disable no-unused-expression */
import { browser, protractor, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CommentComponentsPage from './comment-prop.page-object';
import { CommentDeleteDialog } from './comment-prop.page-object';
import CommentUpdatePage from './comment-prop-update.page-object';
import CommentDetailsPage from './comment-prop-details.page-object';
import {
  waitUntilDisplayed,
  waitUntilHidden,
  getDangerToast,
  getInfoToast,
  getSuccessToast,
  waitSilentlyUntilDisplayed
} from '../../util/utils';

const expect = chai.expect;

describe('Comment e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let commentUpdatePage: CommentUpdatePage;
  let commentDetailsPage: CommentDetailsPage;
  let commentComponentsPage: CommentComponentsPage;
  /*let commentDeleteDialog: CommentDeleteDialog;*/
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

  it('should load Comments', async () => {
    await navBarPage.getEntityPage('comment-prop');
    commentComponentsPage = new CommentComponentsPage();

    await waitSilentlyUntilDisplayed(commentComponentsPage.getDeleteButtons().last());
    const heading = commentComponentsPage.getTitle();
    await waitUntilDisplayed(heading);

    const footer = commentComponentsPage.getFooter();
    await waitUntilDisplayed(footer);

    expect(await heading.getText()).not.to.be.empty;
    nbButtonsBeforeCreate = await commentComponentsPage.countComment();
  });

  it('should load create Comment page', async () => {
    await commentComponentsPage.clickOnCreateButton();
    commentUpdatePage = new CommentUpdatePage();

    const heading = commentUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = commentUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(commentUpdatePage.getSaveButton());

    expect(await heading.getAttribute('id')).to.match(/proposalApp.comment.home.createOrEditLabel/);
  });

  /* it('should create and save Comments', async () => {

    await commentUpdatePage.setTextInput('text');
    expect(await commentUpdatePage.getTextInput()).to.match(/text/);


    await commentUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await commentUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');

    // await commentUpdatePage.authorSelectLastOption();
    // await commentUpdatePage.proposalSelectLastOption();

    await commentUpdatePage.save();
    await waitUntilHidden(commentUpdatePage.getSaveButton());
    expect(await commentUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getSuccessToast();
    await waitUntilDisplayed(toast);
    // Success toast should appear
    expect(await toast.isPresent()).to.be.true;

    await commentComponentsPage.waitUntilCommentCountIs(nbButtonsBeforeCreate + 1);
    expect(await commentComponentsPage.countComment()).to.eq(nbButtonsBeforeCreate + 1);
  });*/

  it('should load details Comment page and fetch data', async () => {
    await commentComponentsPage.waitUntilLoaded();
    await commentComponentsPage.clickOnLastDetailsButton();
    commentDetailsPage = new CommentDetailsPage();

    const heading = commentDetailsPage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = commentUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(await commentDetailsPage.getBackButton());
    expect(await heading.getText()).not.to.be.empty;

    const firstDetail = commentDetailsPage.getFirstDetail();
    expect(await firstDetail.getText()).not.to.be.empty;

    await commentDetailsPage.getBackButton().click();
    await commentComponentsPage.waitUntilCommentCountIs(nbButtonsBeforeCreate + 1);
  });

  it('should load edit Comment page and fetch data', async () => {
    await commentComponentsPage.waitUntilLoaded();
    await commentComponentsPage.clickOnLastEditButton();
    const heading = commentUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = commentUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(commentUpdatePage.getSaveButton());

    expect(await heading.getText()).not.to.be.empty;

    await commentUpdatePage.clearTextInput();
    await commentUpdatePage.setTextInput('modified');
    expect(await commentUpdatePage.getTextInput()).to.match(/modified/);

    await commentUpdatePage.clearCreatedDateInput();
    await commentUpdatePage.setCreatedDateInput('01/01/2019' + protractor.Key.TAB + '02:30AM');
    expect(await commentUpdatePage.getCreatedDateInput()).to.contain('2019-01-01T02:30');

    await commentUpdatePage.save();

    await waitUntilHidden(commentUpdatePage.getSaveButton());

    expect(await commentUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getInfoToast();
    await waitUntilDisplayed(toast);
    // Info toast should appear
    expect(await toast.isPresent()).to.be.true;
  });

  /* it('should delete last Comment', async () => {
    await commentComponentsPage.waitUntilLoaded();
    const nbCommentBeforeDelete = await commentComponentsPage.countComment();
    await commentComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);
    commentDeleteDialog = new CommentDeleteDialog();
    expect(await commentDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/proposalApp.comment.delete.question/);

    await commentDeleteDialog.clickOnConfirmButton();
    await waitUntilHidden(deleteModal);

    // Delete modal should disappear
    expect(await deleteModal.isDisplayed()).to.be.false;

    const toast = getDangerToast();

    // Danger toast should appear
    expect(await toast.isPresent()).to.be.true;

    expect(await commentComponentsPage.countComment()).to.eq(nbCommentBeforeDelete - 1);

  });*/

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
