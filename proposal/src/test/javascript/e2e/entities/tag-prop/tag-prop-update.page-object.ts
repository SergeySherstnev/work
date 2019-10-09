import { element, by, ElementFinder, protractor, browser } from 'protractor';
import { clearElement, waitUntilDisplayed } from '../../util/utils';

export default class TagUpdatePage {
  getPageTitle() {
    return element(by.id('proposalApp.tag.home.createOrEditLabel'));
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

  findNameInput() {
    return element(by.css('input#tag-prop-name'));
  }

  async setNameInput(name) {
    const elementInput = this.findNameInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(name);
  }

  async getNameInput() {
    const elementInput = this.findNameInput();
    return await elementInput.getAttribute('value');
  }

  async clearNameInput() {
    const elementInput = this.findNameInput();
    await clearElement(elementInput, 100);
  }
}
