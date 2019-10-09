import { element, by, ElementFinder, protractor, browser } from 'protractor';
import { clearElement, waitUntilDisplayed } from '../../util/utils';

export default class HistoryUpdatePage {
  getPageTitle() {
    return element(by.id('proposalApp.history.home.createOrEditLabel'));
  }

  getFooter() {
    return element(by.id('footer'));
  }

  getSaveButton() {
    return element(by.id('save-entity'));
  }

  async isSaveButtonPresent() {
    return await this.getSaveButton().isPresent();
  }

  async save() {
    await this.getSaveButton().click();
  }

  async cancel() {
    await element(by.id('cancel-save')).click();
  }

  //--------------------------------------------------

  findCreatedDateInput() {
    return element(by.css('input#history-prop-createdDate'));
  }

  async setCreatedDateInput(createdDate) {
    const elementInput = this.findCreatedDateInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(createdDate);
  }

  async getCreatedDateInput() {
    const elementInput = this.findCreatedDateInput();
    return await elementInput.getAttribute('value');
  }

  async clearCreatedDateInput() {
    const elementInput = this.findCreatedDateInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  async setStatusSelect(status) {
    const elem = element(by.css('select#history-prop-status'));
    await elem.sendKeys(status);
  }

  async getStatusSelect() {
    const elem = element(by.css('select#history-prop-status'));
    const elemChecked = elem.element(by.css('option:checked'));
    return await elemChecked.getText();
  }

  async statusSelectLastOption() {
    const elem = element(by.css('select#history-prop-status'));
    await elem
      .all(by.tagName('option'))
      .last()
      .click();
  }

  //--------------------------------------------------

  findCommentInput() {
    return element(by.css('input#history-prop-comment'));
  }

  async setCommentInput(comment) {
    const elementInput = this.findCommentInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(comment);
  }

  async getCommentInput() {
    const elementInput = this.findCommentInput();
    return await elementInput.getAttribute('value');
  }

  async clearCommentInput() {
    const elementInput = this.findCommentInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  getExecutiveSelect() {
    return element(by.css('select#history-prop-executive'));
  }

  async getExecutiveSelectLastOption() {
    const elem = this.getExecutiveSelect();
    await elem
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async getExecutiveSelectOption(option) {
    const elem = this.getExecutiveSelect();
    await elem.sendKeys(option);
  }

  async getExecutiveSelectedOption() {
    const elem = this.getExecutiveSelect();
    return await elem.element(by.css('option:checked')).getText();
  }

  //--------------------------------------------------

  getAssigneeSelect() {
    return element(by.css('select#history-prop-assignee'));
  }

  async getAssigneeSelectLastOption() {
    const elem = this.getAssigneeSelect();
    await elem
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async getAssigneeSelectOption(option) {
    const elem = this.getAssigneeSelect();
    await elem.sendKeys(option);
  }

  async getAssigneeSelectedOption() {
    const elem = this.getAssigneeSelect();
    return await elem.element(by.css('option:checked')).getText();
  }

  //--------------------------------------------------

  getProposalSelect() {
    return element(by.css('select#history-prop-proposal'));
  }

  async getProposalSelectLastOption() {
    const elem = this.getProposalSelect();
    await elem
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async getProposalSelectOption(option) {
    const elem = this.getProposalSelect();
    await elem.sendKeys(option);
  }

  async getProposalSelectedOption() {
    const elem = this.getProposalSelect();
    return await elem.element(by.css('option:checked')).getText();
  }
}
