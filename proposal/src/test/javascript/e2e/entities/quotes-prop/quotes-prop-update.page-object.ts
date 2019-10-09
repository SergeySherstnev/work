import { element, by, ElementFinder, protractor, browser } from 'protractor';
import { clearElement, waitUntilDisplayed } from '../../util/utils';

export default class QuotesUpdatePage {
  getPageTitle() {
    return element(by.id('proposalApp.quotes.home.createOrEditLabel'));
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
    return element(by.css('input#quotes-prop-text'));
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

  findAuthorInput() {
    return element(by.css('input#quotes-prop-author'));
  }

  async setAuthorInput(author) {
    const elementInput = this.findAuthorInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(author);
  }

  async getAuthorInput() {
    const elementInput = this.findAuthorInput();
    return await elementInput.getAttribute('value');
  }

  async clearAuthorInput() {
    const elementInput = this.findAuthorInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findCategoryInput() {
    return element(by.css('input#quotes-prop-category'));
  }

  async setCategoryInput(category) {
    const elementInput = this.findCategoryInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(category);
  }

  async getCategoryInput() {
    const elementInput = this.findCategoryInput();
    return await elementInput.getAttribute('value');
  }

  async clearCategoryInput() {
    const elementInput = this.findCategoryInput();
    await clearElement(elementInput, 100);
  }
}
