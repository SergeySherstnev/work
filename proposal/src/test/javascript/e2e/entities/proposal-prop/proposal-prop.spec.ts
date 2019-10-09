/* tslint:disable no-unused-expression */
import { browser, protractor, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ProposalComponentsPage from './proposal-prop.page-object';
import { ProposalDeleteDialog } from './proposal-prop.page-object';
import ProposalUpdatePage from './proposal-prop-update.page-object';
import ProposalDetailsPage from './proposal-prop-details.page-object';
import {
  waitUntilDisplayed,
  waitUntilHidden,
  getDangerToast,
  getInfoToast,
  getSuccessToast,
  waitSilentlyUntilDisplayed
} from '../../util/utils';

const expect = chai.expect;

describe('Proposal e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let proposalUpdatePage: ProposalUpdatePage;
  let proposalDetailsPage: ProposalDetailsPage;
  let proposalComponentsPage: ProposalComponentsPage;
  /*let proposalDeleteDialog: ProposalDeleteDialog;*/
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

  it('should load Proposals', async () => {
    await navBarPage.getEntityPage('proposal-prop');
    proposalComponentsPage = new ProposalComponentsPage();

    await waitSilentlyUntilDisplayed(proposalComponentsPage.getDeleteButtons().last());
    const heading = proposalComponentsPage.getTitle();
    await waitUntilDisplayed(heading);

    const footer = proposalComponentsPage.getFooter();
    await waitUntilDisplayed(footer);

    expect(await heading.getText()).not.to.be.empty;
    nbButtonsBeforeCreate = await proposalComponentsPage.countProposal();
  });

  it('should load create Proposal page', async () => {
    await proposalComponentsPage.clickOnCreateButton();
    proposalUpdatePage = new ProposalUpdatePage();

    const heading = proposalUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = proposalUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(proposalUpdatePage.getSaveButton());

    expect(await heading.getAttribute('id')).to.match(/proposalApp.proposal.home.createOrEditLabel/);
  });

  /* it('should create and save Proposals', async () => {

    await proposalUpdatePage.setCaptionInput('caption');
    expect(await proposalUpdatePage.getCaptionInput()).to.match(/caption/);


    await proposalUpdatePage.setDescriptionInput('description');
    expect(await proposalUpdatePage.getDescriptionInput()).to.match(/description/);


    await proposalUpdatePage.setPriorityInput('5');
    expect(await proposalUpdatePage.getPriorityInput()).to.eq('5');


    await proposalUpdatePage.setAlikeSumInput('5');
    expect(await proposalUpdatePage.getAlikeSumInput()).to.eq('5');


    await proposalUpdatePage.setCommentSumInput('5');
    expect(await proposalUpdatePage.getCommentSumInput()).to.eq('5');


    await proposalUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await proposalUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');


    await proposalUpdatePage.setUpdatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await proposalUpdatePage.getUpdatedDateInput()).to.contain('2001-01-01T02:30');


    await proposalUpdatePage.statusSelectLastOption();

    // await proposalUpdatePage.authorSelectLastOption();
    // proposalUpdatePage.tagSelectLastOption();

    await proposalUpdatePage.save();
    await waitUntilHidden(proposalUpdatePage.getSaveButton());
    expect(await proposalUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getSuccessToast();
    await waitUntilDisplayed(toast);
    // Success toast should appear
    expect(await toast.isPresent()).to.be.true;

    await proposalComponentsPage.waitUntilProposalCountIs(nbButtonsBeforeCreate + 1);
    expect(await proposalComponentsPage.countProposal()).to.eq(nbButtonsBeforeCreate + 1);
  });*/

  it('should load details Proposal page and fetch data', async () => {
    await proposalComponentsPage.waitUntilLoaded();
    await proposalComponentsPage.clickOnLastDetailsButton();
    proposalDetailsPage = new ProposalDetailsPage();

    const heading = proposalDetailsPage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = proposalUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(await proposalDetailsPage.getBackButton());
    expect(await heading.getText()).not.to.be.empty;

    const firstDetail = proposalDetailsPage.getFirstDetail();
    expect(await firstDetail.getText()).not.to.be.empty;

    await proposalDetailsPage.getBackButton().click();
    await proposalComponentsPage.waitUntilProposalCountIs(nbButtonsBeforeCreate + 1);
  });

  it('should load edit Proposal page and fetch data', async () => {
    await proposalComponentsPage.waitUntilLoaded();
    await proposalComponentsPage.clickOnLastEditButton();
    const heading = proposalUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = proposalUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(proposalUpdatePage.getSaveButton());

    expect(await heading.getText()).not.to.be.empty;

    await proposalUpdatePage.clearCaptionInput();
    await proposalUpdatePage.setCaptionInput('modified');
    expect(await proposalUpdatePage.getCaptionInput()).to.match(/modified/);

    await proposalUpdatePage.clearDescriptionInput();
    await proposalUpdatePage.setDescriptionInput('modified');
    expect(await proposalUpdatePage.getDescriptionInput()).to.match(/modified/);

    await proposalUpdatePage.clearPriorityInput();
    await proposalUpdatePage.setPriorityInput('6');
    expect(await proposalUpdatePage.getPriorityInput()).to.eq('6');

    await proposalUpdatePage.clearAlikeSumInput();
    await proposalUpdatePage.setAlikeSumInput('6');
    expect(await proposalUpdatePage.getAlikeSumInput()).to.eq('6');

    await proposalUpdatePage.clearCommentSumInput();
    await proposalUpdatePage.setCommentSumInput('6');
    expect(await proposalUpdatePage.getCommentSumInput()).to.eq('6');

    await proposalUpdatePage.clearCreatedDateInput();
    await proposalUpdatePage.setCreatedDateInput('01/01/2019' + protractor.Key.TAB + '02:30AM');
    expect(await proposalUpdatePage.getCreatedDateInput()).to.contain('2019-01-01T02:30');

    await proposalUpdatePage.clearUpdatedDateInput();
    await proposalUpdatePage.setUpdatedDateInput('01/01/2019' + protractor.Key.TAB + '02:30AM');
    expect(await proposalUpdatePage.getUpdatedDateInput()).to.contain('2019-01-01T02:30');

    await proposalUpdatePage.save();

    await waitUntilHidden(proposalUpdatePage.getSaveButton());

    expect(await proposalUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getInfoToast();
    await waitUntilDisplayed(toast);
    // Info toast should appear
    expect(await toast.isPresent()).to.be.true;
  });

  /* it('should delete last Proposal', async () => {
    await proposalComponentsPage.waitUntilLoaded();
    const nbProposalBeforeDelete = await proposalComponentsPage.countProposal();
    await proposalComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);
    proposalDeleteDialog = new ProposalDeleteDialog();
    expect(await proposalDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/proposalApp.proposal.delete.question/);

    await proposalDeleteDialog.clickOnConfirmButton();
    await waitUntilHidden(deleteModal);

    // Delete modal should disappear
    expect(await deleteModal.isDisplayed()).to.be.false;

    const toast = getDangerToast();

    // Danger toast should appear
    expect(await toast.isPresent()).to.be.true;

    expect(await proposalComponentsPage.countProposal()).to.eq(nbProposalBeforeDelete - 1);

  });*/

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
