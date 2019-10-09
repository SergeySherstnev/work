/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import TagComponentsPage from './tag-prop.page-object';
import { TagDeleteDialog } from './tag-prop.page-object';
import TagUpdatePage from './tag-prop-update.page-object';
import TagDetailsPage from './tag-prop-details.page-object';
import {
  waitUntilDisplayed,
  waitUntilHidden,
  getDangerToast,
  getInfoToast,
  getSuccessToast,
  waitSilentlyUntilDisplayed
} from '../../util/utils';

const expect = chai.expect;

describe('Tag e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let tagUpdatePage: TagUpdatePage;
  let tagDetailsPage: TagDetailsPage;
  let tagComponentsPage: TagComponentsPage;
  let tagDeleteDialog: TagDeleteDialog;
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

  it('should load Tags', async () => {
    await navBarPage.getEntityPage('tag-prop');
    tagComponentsPage = new TagComponentsPage();

    await waitSilentlyUntilDisplayed(tagComponentsPage.getDeleteButtons().last());
    const heading = tagComponentsPage.getTitle();
    await waitUntilDisplayed(heading);

    const footer = tagComponentsPage.getFooter();
    await waitUntilDisplayed(footer);

    expect(await heading.getText()).not.to.be.empty;
    nbButtonsBeforeCreate = await tagComponentsPage.countTag();
  });

  it('should load create Tag page', async () => {
    await tagComponentsPage.clickOnCreateButton();
    tagUpdatePage = new TagUpdatePage();

    const heading = tagUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = tagUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(tagUpdatePage.getSaveButton());

    expect(await heading.getAttribute('id')).to.match(/proposalApp.tag.home.createOrEditLabel/);
  });

  it('should create and save Tags', async () => {
    await tagUpdatePage.setNameInput('name');
    expect(await tagUpdatePage.getNameInput()).to.match(/name/);

    await tagUpdatePage.save();
    await waitUntilHidden(tagUpdatePage.getSaveButton());
    expect(await tagUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getSuccessToast();
    await waitUntilDisplayed(toast);
    // Success toast should appear
    expect(await toast.isPresent()).to.be.true;

    await tagComponentsPage.waitUntilTagCountIs(nbButtonsBeforeCreate + 1);
    expect(await tagComponentsPage.countTag()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should load details Tag page and fetch data', async () => {
    await tagComponentsPage.waitUntilLoaded();
    await tagComponentsPage.clickOnLastDetailsButton();
    tagDetailsPage = new TagDetailsPage();

    const heading = tagDetailsPage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = tagUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(await tagDetailsPage.getBackButton());
    expect(await heading.getText()).not.to.be.empty;

    const firstDetail = tagDetailsPage.getFirstDetail();
    expect(await firstDetail.getText()).not.to.be.empty;

    await tagDetailsPage.getBackButton().click();
    await tagComponentsPage.waitUntilTagCountIs(nbButtonsBeforeCreate + 1);
  });

  it('should load edit Tag page and fetch data', async () => {
    await tagComponentsPage.waitUntilLoaded();
    await tagComponentsPage.clickOnLastEditButton();
    const heading = tagUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = tagUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(tagUpdatePage.getSaveButton());

    expect(await heading.getText()).not.to.be.empty;

    await tagUpdatePage.clearNameInput();
    await tagUpdatePage.setNameInput('modified');
    expect(await tagUpdatePage.getNameInput()).to.match(/modified/);

    await tagUpdatePage.save();

    await waitUntilHidden(tagUpdatePage.getSaveButton());

    expect(await tagUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getInfoToast();
    await waitUntilDisplayed(toast);
    // Info toast should appear
    expect(await toast.isPresent()).to.be.true;
  });

  it('should delete last Tag', async () => {
    await tagComponentsPage.waitUntilLoaded();
    const nbTagBeforeDelete = await tagComponentsPage.countTag();
    await tagComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);
    tagDeleteDialog = new TagDeleteDialog();
    expect(await tagDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/proposalApp.tag.delete.question/);

    await tagDeleteDialog.clickOnConfirmButton();
    await waitUntilHidden(deleteModal);

    // Delete modal should disappear
    expect(await deleteModal.isDisplayed()).to.be.false;

    const toast = getDangerToast();

    // Danger toast should appear
    expect(await toast.isPresent()).to.be.true;

    expect(await tagComponentsPage.countTag()).to.eq(nbTagBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
