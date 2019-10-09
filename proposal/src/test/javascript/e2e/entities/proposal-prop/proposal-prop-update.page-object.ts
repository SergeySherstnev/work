import { element, by, ElementFinder, protractor, browser } from 'protractor';
import { clearElement, waitUntilDisplayed } from '../../util/utils';

export default class ProposalUpdatePage {
  getPageTitle() {
    return element(by.id('proposalApp.proposal.home.createOrEditLabel'));
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

  findCaptionInput() {
    return element(by.css('input#proposal-prop-caption'));
  }

  async setCaptionInput(caption) {
    const elementInput = this.findCaptionInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(caption);
  }

  async getCaptionInput() {
    const elementInput = this.findCaptionInput();
    return await elementInput.getAttribute('value');
  }

  async clearCaptionInput() {
    const elementInput = this.findCaptionInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findDescriptionInput() {
    return element(by.css('input#proposal-prop-description'));
  }

  async setDescriptionInput(description) {
    const elementInput = this.findDescriptionInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(description);
  }

  async getDescriptionInput() {
    const elementInput = this.findDescriptionInput();
    return await elementInput.getAttribute('value');
  }

  async clearDescriptionInput() {
    const elementInput = this.findDescriptionInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findPriorityInput() {
    return element(by.css('input#proposal-prop-priority'));
  }

  async setPriorityInput(priority) {
    const elementInput = this.findPriorityInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(priority);
  }

  async getPriorityInput() {
    const elementInput = this.findPriorityInput();
    return await elementInput.getAttribute('value');
  }

  async clearPriorityInput() {
    const elementInput = this.findPriorityInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findAlikeSumInput() {
    return element(by.css('input#proposal-prop-alikeSum'));
  }

  async setAlikeSumInput(alikeSum) {
    const elementInput = this.findAlikeSumInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(alikeSum);
  }

  async getAlikeSumInput() {
    const elementInput = this.findAlikeSumInput();
    return await elementInput.getAttribute('value');
  }

  async clearAlikeSumInput() {
    const elementInput = this.findAlikeSumInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findCommentSumInput() {
    return element(by.css('input#proposal-prop-commentSum'));
  }

  async setCommentSumInput(commentSum) {
    const elementInput = this.findCommentSumInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(commentSum);
  }

  async getCommentSumInput() {
    const elementInput = this.findCommentSumInput();
    return await elementInput.getAttribute('value');
  }

  async clearCommentSumInput() {
    const elementInput = this.findCommentSumInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findCreatedDateInput() {
    return element(by.css('input#proposal-prop-createdDate'));
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

  findUpdatedDateInput() {
    return element(by.css('input#proposal-prop-updatedDate'));
  }

  async setUpdatedDateInput(updatedDate) {
    const elementInput = this.findUpdatedDateInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(updatedDate);
  }

  async getUpdatedDateInput() {
    const elementInput = this.findUpdatedDateInput();
    return await elementInput.getAttribute('value');
  }

  async clearUpdatedDateInput() {
    const elementInput = this.findUpdatedDateInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  async setStatusSelect(status) {
    const elem = element(by.css('select#proposal-prop-status'));
    await elem.sendKeys(status);
  }

  async getStatusSelect() {
    const elem = element(by.css('select#proposal-prop-status'));
    const elemChecked = elem.element(by.css('option:checked'));
    return await elemChecked.getText();
  }

  async statusSelectLastOption() {
    const elem = element(by.css('select#proposal-prop-status'));
    await elem
      .all(by.tagName('option'))
      .last()
      .click();
  }

  //--------------------------------------------------

  getAuthorSelect() {
    return element(by.css('select#proposal-prop-author'));
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

  getTagSelect() {
    return element(by.css('select#proposal-prop-tag'));
  }

  async getTagSelectLastOption() {
    const elem = this.getTagSelect();
    await elem
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async getTagSelectOption(option) {
    const elem = this.getTagSelect();
    await elem.sendKeys(option);
  }

  async getTagSelectedOption() {
    const elem = this.getTagSelect();
    return await elem.element(by.css('option:checked')).getText();
  }
}
