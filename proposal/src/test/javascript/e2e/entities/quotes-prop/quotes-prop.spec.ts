/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import QuotesComponentsPage from './quotes-prop.page-object';
import { QuotesDeleteDialog } from './quotes-prop.page-object';
import QuotesUpdatePage from './quotes-prop-update.page-object';
import QuotesDetailsPage from './quotes-prop-details.page-object';
import {
  waitUntilDisplayed,
  waitUntilHidden,
  getDangerToast,
  getInfoToast,
  getSuccessToast,
  waitSilentlyUntilDisplayed
} from '../../util/utils';

const expect = chai.expect;

describe('Quotes e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let quotesUpdatePage: QuotesUpdatePage;
  let quotesDetailsPage: QuotesDetailsPage;
  let quotesComponentsPage: QuotesComponentsPage;
  let quotesDeleteDialog: QuotesDeleteDialog;
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

  it('should load Quotes', async () => {
    await navBarPage.getEntityPage('quotes-prop');
    quotesComponentsPage = new QuotesComponentsPage();

    await waitSilentlyUntilDisplayed(quotesComponentsPage.getDeleteButtons().last());
    const heading = quotesComponentsPage.getTitle();
    await waitUntilDisplayed(heading);

    const footer = quotesComponentsPage.getFooter();
    await waitUntilDisplayed(footer);

    expect(await heading.getText()).not.to.be.empty;
    nbButtonsBeforeCreate = await quotesComponentsPage.countQuotes();
  });

  it('should load create Quotes page', async () => {
    await quotesComponentsPage.clickOnCreateButton();
    quotesUpdatePage = new QuotesUpdatePage();

    const heading = quotesUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = quotesUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(quotesUpdatePage.getSaveButton());

    expect(await heading.getAttribute('id')).to.match(/proposalApp.quotes.home.createOrEditLabel/);
  });

  it('should create and save Quotes', async () => {
    await quotesUpdatePage.setTextInput('text');
    expect(await quotesUpdatePage.getTextInput()).to.match(/text/);

    await quotesUpdatePage.setAuthorInput('author');
    expect(await quotesUpdatePage.getAuthorInput()).to.match(/author/);

    await quotesUpdatePage.setCategoryInput('category');
    expect(await quotesUpdatePage.getCategoryInput()).to.match(/category/);

    await quotesUpdatePage.save();
    await waitUntilHidden(quotesUpdatePage.getSaveButton());
    expect(await quotesUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getSuccessToast();
    await waitUntilDisplayed(toast);
    // Success toast should appear
    expect(await toast.isPresent()).to.be.true;

    await quotesComponentsPage.waitUntilQuotesCountIs(nbButtonsBeforeCreate + 1);
    expect(await quotesComponentsPage.countQuotes()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should load details Quotes page and fetch data', async () => {
    await quotesComponentsPage.waitUntilLoaded();
    await quotesComponentsPage.clickOnLastDetailsButton();
    quotesDetailsPage = new QuotesDetailsPage();

    const heading = quotesDetailsPage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = quotesUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(await quotesDetailsPage.getBackButton());
    expect(await heading.getText()).not.to.be.empty;

    const firstDetail = quotesDetailsPage.getFirstDetail();
    expect(await firstDetail.getText()).not.to.be.empty;

    await quotesDetailsPage.getBackButton().click();
    await quotesComponentsPage.waitUntilQuotesCountIs(nbButtonsBeforeCreate + 1);
  });

  it('should load edit Quotes page and fetch data', async () => {
    await quotesComponentsPage.waitUntilLoaded();
    await quotesComponentsPage.clickOnLastEditButton();
    const heading = quotesUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = quotesUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(quotesUpdatePage.getSaveButton());

    expect(await heading.getText()).not.to.be.empty;

    await quotesUpdatePage.clearTextInput();
    await quotesUpdatePage.setTextInput('modified');
    expect(await quotesUpdatePage.getTextInput()).to.match(/modified/);

    await quotesUpdatePage.clearAuthorInput();
    await quotesUpdatePage.setAuthorInput('modified');
    expect(await quotesUpdatePage.getAuthorInput()).to.match(/modified/);

    await quotesUpdatePage.clearCategoryInput();
    await quotesUpdatePage.setCategoryInput('modified');
    expect(await quotesUpdatePage.getCategoryInput()).to.match(/modified/);

    await quotesUpdatePage.save();

    await waitUntilHidden(quotesUpdatePage.getSaveButton());

    expect(await quotesUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getInfoToast();
    await waitUntilDisplayed(toast);
    // Info toast should appear
    expect(await toast.isPresent()).to.be.true;
  });

  it('should delete last Quotes', async () => {
    await quotesComponentsPage.waitUntilLoaded();
    const nbQuotesBeforeDelete = await quotesComponentsPage.countQuotes();
    await quotesComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);
    quotesDeleteDialog = new QuotesDeleteDialog();
    expect(await quotesDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/proposalApp.quotes.delete.question/);

    await quotesDeleteDialog.clickOnConfirmButton();
    await waitUntilHidden(deleteModal);

    // Delete modal should disappear
    expect(await deleteModal.isDisplayed()).to.be.false;

    const toast = getDangerToast();

    // Danger toast should appear
    expect(await toast.isPresent()).to.be.true;

    expect(await quotesComponentsPage.countQuotes()).to.eq(nbQuotesBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
