/* tslint:disable no-unused-expression */
import { browser, protractor, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import HistoryComponentsPage from './history-prop.page-object';
import { HistoryDeleteDialog } from './history-prop.page-object';
import HistoryUpdatePage from './history-prop-update.page-object';
import HistoryDetailsPage from './history-prop-details.page-object';
import {
  waitUntilDisplayed,
  waitUntilHidden,
  getDangerToast,
  getInfoToast,
  getSuccessToast,
  waitSilentlyUntilDisplayed
} from '../../util/utils';

const expect = chai.expect;

describe('History e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let historyUpdatePage: HistoryUpdatePage;
  let historyDetailsPage: HistoryDetailsPage;
  let historyComponentsPage: HistoryComponentsPage;
  /*let historyDeleteDialog: HistoryDeleteDialog;*/
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

  it('should load Histories', async () => {
    await navBarPage.getEntityPage('history-prop');
    historyComponentsPage = new HistoryComponentsPage();

    await waitSilentlyUntilDisplayed(historyComponentsPage.getDeleteButtons().last());
    const heading = historyComponentsPage.getTitle();
    await waitUntilDisplayed(heading);

    const footer = historyComponentsPage.getFooter();
    await waitUntilDisplayed(footer);

    expect(await heading.getText()).not.to.be.empty;
    nbButtonsBeforeCreate = await historyComponentsPage.countHistory();
  });

  it('should load create History page', async () => {
    await historyComponentsPage.clickOnCreateButton();
    historyUpdatePage = new HistoryUpdatePage();

    const heading = historyUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = historyUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(historyUpdatePage.getSaveButton());

    expect(await heading.getAttribute('id')).to.match(/proposalApp.history.home.createOrEditLabel/);
  });

  /* it('should create and save Histories', async () => {

    await historyUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await historyUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');


    await historyUpdatePage.statusSelectLastOption();


    await historyUpdatePage.setCommentInput('comment');
    expect(await historyUpdatePage.getCommentInput()).to.match(/comment/);

    // await historyUpdatePage.executiveSelectLastOption();
    // await historyUpdatePage.assigneeSelectLastOption();
    // await historyUpdatePage.proposalSelectLastOption();

    await historyUpdatePage.save();
    await waitUntilHidden(historyUpdatePage.getSaveButton());
    expect(await historyUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getSuccessToast();
    await waitUntilDisplayed(toast);
    // Success toast should appear
    expect(await toast.isPresent()).to.be.true;

    await historyComponentsPage.waitUntilHistoryCountIs(nbButtonsBeforeCreate + 1);
    expect(await historyComponentsPage.countHistory()).to.eq(nbButtonsBeforeCreate + 1);
  });*/

  it('should load details History page and fetch data', async () => {
    await historyComponentsPage.waitUntilLoaded();
    await historyComponentsPage.clickOnLastDetailsButton();
    historyDetailsPage = new HistoryDetailsPage();

    const heading = historyDetailsPage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = historyUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(await historyDetailsPage.getBackButton());
    expect(await heading.getText()).not.to.be.empty;

    const firstDetail = historyDetailsPage.getFirstDetail();
    expect(await firstDetail.getText()).not.to.be.empty;

    await historyDetailsPage.getBackButton().click();
    await historyComponentsPage.waitUntilHistoryCountIs(nbButtonsBeforeCreate + 1);
  });

  it('should load edit History page and fetch data', async () => {
    await historyComponentsPage.waitUntilLoaded();
    await historyComponentsPage.clickOnLastEditButton();
    const heading = historyUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = historyUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(historyUpdatePage.getSaveButton());

    expect(await heading.getText()).not.to.be.empty;

    await historyUpdatePage.clearCreatedDateInput();
    await historyUpdatePage.setCreatedDateInput('01/01/2019' + protractor.Key.TAB + '02:30AM');
    expect(await historyUpdatePage.getCreatedDateInput()).to.contain('2019-01-01T02:30');

    await historyUpdatePage.clearCommentInput();
    await historyUpdatePage.setCommentInput('modified');
    expect(await historyUpdatePage.getCommentInput()).to.match(/modified/);

    await historyUpdatePage.save();

    await waitUntilHidden(historyUpdatePage.getSaveButton());

    expect(await historyUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getInfoToast();
    await waitUntilDisplayed(toast);
    // Info toast should appear
    expect(await toast.isPresent()).to.be.true;
  });

  /* it('should delete last History', async () => {
    await historyComponentsPage.waitUntilLoaded();
    const nbHistoryBeforeDelete = await historyComponentsPage.countHistory();
    await historyComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);
    historyDeleteDialog = new HistoryDeleteDialog();
    expect(await historyDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/proposalApp.history.delete.question/);

    await historyDeleteDialog.clickOnConfirmButton();
    await waitUntilHidden(deleteModal);

    // Delete modal should disappear
    expect(await deleteModal.isDisplayed()).to.be.false;

    const toast = getDangerToast();

    // Danger toast should appear
    expect(await toast.isPresent()).to.be.true;

    expect(await historyComponentsPage.countHistory()).to.eq(nbHistoryBeforeDelete - 1);

  });*/

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
