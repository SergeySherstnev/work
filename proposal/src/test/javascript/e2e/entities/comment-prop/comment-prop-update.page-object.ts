import { element, by, ElementFinder, protractor, browser } from 'protractor';
import { clearElement, waitUntilDisplayed } from '../../util/utils';

export default class CommentUpdatePage {
  getPageTitle() {
    return element(by.id('proposalApp.comment.home.createOrEditLabel'));
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

  findTextInput() {
    return element(by.css('input#comment-prop-text'));
  }

  async setTextInput(text) {
    const elementInput = this.findTextInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(text);
  }

  async getTextInput() {
    const elementInput = this.findTextInput();
    return await elementInput.getAttribute('value');
  }

  async clearTextInput() {
    const elementInput = this.findTextInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findCreatedDateInput() {
    return element(by.css('input#comment-prop-createdDate'));
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

  getAuthorSelect() {
    return element(by.css('select#comment-prop-author'));
  }

  async getAuthorSelectLastOption() {
    const elem = this.getAuthorSelect();
    await elem
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async getAuthorSelectOption(option) {
    const elem = this.getAuthorSelect();
    await elem.sendKeys(option);
  }

  async getAuthorSelectedOption() {
    const elem = this.getAuthorSelect();
    return await elem.element(by.css('option:checked')).getText();
  }

  //--------------------------------------------------

  getProposalSelect() {
    return element(by.css('select#comment-prop-proposal'));
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
