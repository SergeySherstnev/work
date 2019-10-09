import { element, by, ElementFinder } from 'protractor';

import { waitUntilCount, waitUntilDisplayed } from '../../util/utils';

export default class QuotesComponentsPage {
  async isSaveButtonPresent() {
    return await element(by.id('save-entity')).isPresent();
  }

  async save() {
    await element(by.id('save-entity')).click();
  }

  async cancel() {
    await element(by.id('cancel-save')).click();
  }

  getCreateButton() {
    return element(by.id('jh-create-entity'));
  }

  async clickOnCreateButton() {
    await this.getCreateButton().click();
  }

  getDetailButtons() {
    return element.all(by.css('.btn-info.details'));
  }

  async clickOnLastDetailsButton() {
    await this.getDetailButtons()
      .last()
      .click();
  }

  getEditButtons() {
    return element.all(by.css('.btn-primary.edit'));
  }

  async clickOnLastEditButton() {
    await this.getEditButtons()
      .last()
      .click();
  }

  getDeleteButtons() {
    return element.all(by.css('div table .btn-danger'));
  }

  async clickOnLastDeleteButton() {
    await this.getDeleteButtons()
      .last()
      .click();
  }

  async countQuotes() {
    return await element.all(by.css('div table .btn-danger')).count();
  }

  getTitle() {
    return element(by.id('quotes-prop-heading'));
  }

  getFooter() {
    return element(by.id('footer'));
  }

  async waitUntilLoaded() {
    await waitUntilDisplayed(element.all(by.css('div table .btn-danger')).first());
  }

  async waitUntilQuotesCountIs(length) {
    await waitUntilCount(element.all(by.css('div table .btn-danger')), length);
  }
}

export class QuotesDeleteDialog {
  private dialogTitle: ElementFinder = element(by.id('proposalApp.quotes.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-quotes'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}
