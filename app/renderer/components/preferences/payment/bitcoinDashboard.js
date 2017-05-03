/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const {StyleSheet, css} = require('aphrodite/no-important')

// components
const Button = require('../../../../../js/components/button')
const cx = require('../../../../../js/lib/classSet')
const ModalOverlay = require('../../../../../js/components/modalOverlay')
const ImmutableComponent = require('../../immutableComponent')

// styles
const globalStyles = require('../../styles/global')
const commonStyles = require('../../styles/commonStyles')

const CoinBase = require('../../../../extensions/brave/img/coinbase_logo.png')
const Andorid = require('../../../../extensions/brave/img/android_download.svg')
const IOS = require('../../../../extensions/brave/img/ios_download.svg')

// other
const coinbaseCountries = require('../../../../../js/constants/coinbaseCountries')
const config = require('../../../../../js/constants/config')
const getSetting = require('../../../../../js/settings').getSetting
const settings = require('../../../../../js/constants/settings')
const aboutActions = require('../../../../../js/about/aboutActions')

class BitcoinDashboard extends ImmutableComponent {
  constructor () {
    super()
    this.buyCompleted = false
    this.openBuyURLTab = this.openBuyURLTab.bind(this)
  }

  get currency () {
    return this.props.ledgerData.get('currency') || 'USD'
  }

  get amount () {
    return getSetting(settings.PAYMENTS_CONTRIBUTION_AMOUNT, this.props.settings) || 0
  }

  get canUseCoinbase () {
    if (!this.props.ledgerData.get('buyMaximumUSD')) return true

    return this.currency === 'USD' && this.amount < this.props.ledgerData.get('buyMaximumUSD')
  }

  get userInAmerica () {
    const countryCode = this.props.ledgerData.get('countryCode')
    return !(countryCode && countryCode !== 'US')
  }

  openBuyURLTab () {
    // close parent dialog
    this.props.hideParentOverlay()
  }

  faCreditCard () {
    return <span className={cx({
      fa: true,
      'fa-credit-card': true,
      [css(styles.faCreditCard)]: true
    })} />
  }
  faBitcoin () {
    return <span className={cx({
      'fa-stack': true,
      'fa-lg': true
    })}>
      <span className={cx({
        fa: true,
        'fa-circle': true,
        'fa-stack-2x': true,
        [css(styles.faCircle)]: true
      })} />
      <span className={cx({
        fa: true,
        'fa-bitcoin': true,
        'fa-stack-1x': true,
        [css(styles.faBitcoin)]: true
      })} />
    </span>
  }
  faSmartphone () {
    return <span className={cx({
      fa: true,
      'fa-mobile': true,
      [css(styles.faMobile)]: true
    })} />
  }

  bitcoinPurchaseButton () {
    if (!this.props.ledgerData.get('buyURLFrame')) {
      /* TODO refactor button */
      return <Button className={cx({
        primaryButton: true,
        [css(styles.panelButton)]: true
      })}
        l10nId='add'
        testId='bitcoinPurchaseButton'
        onClick={this.props.showOverlay.bind(this)}
      />
    }

    return <a href={this.props.ledgerData.get('buyURL')} target='_blank' onClick={this.openBuyURLTab}>
      {/* TODO: refactor button.js */}
      <Button className={cx({
        primaryButton: true,
        [css(styles.panelButton)]: true
      })}
        l10nId='add'
        testId='bitcoinPurchaseButton'
      />
    </a>
  }

  coinbasePanel () {
    if (this.canUseCoinbase) {
      return <div className={css(styles.panel, styles.panel__coinbase)}>
        <div className={css(styles.panel__divider, styles.panel__divider_left)}>
          <div className={css(styles.panel__divider_left__titleWrapper)}>
            <div className={css(styles.panel__divider_left__titleWrapper__iconWrapper)}>
              {this.faCreditCard()}
            </div>
            <div className={css(styles.panel__divider_left__listTitleWrapper)}>
              <div className={css(styles.panel__divider_left__listTitleWrapper__title)} data-l10n-id='moneyAdd' />
              <div className={css(
                styles.panel__divider_left__listTitleWrapper__title,
                styles.panel__divider_left__listTitleWrapper__subTitle
              )} data-l10n-id='moneyAddSubTitle' />
            </div>
          </div>
        </div>
        <div className={css(styles.panel__divider, styles.panel__divider_right)}>
          {this.bitcoinPurchaseButton()}
          <div className={css(
            styles.panel__divider_right__title,
            styles.panel__divider_right__subTitle
          )} data-l10n-id='transferTime' />
        </div>
      </div>
    } else {
      return <div className={css(styles.panel, styles.panel__coinbase)}>
        <div className={css(styles.panel__divider, styles.panel__divider_left)}>
          <div className={css(styles.panel__divider_left__titleWrapper)}>
            <div className={css(styles.panel__divider_left__titleWrapper__iconWrapper)}>
              {this.faCreditCard()}
            </div>
            <div className={css(styles.panel__divider_left__listTitleWrapper)}>
              <div className={css(styles.panel__divider_left__listTitleWrapper__title)} data-l10n-id='moneyAdd' />
              <div className={css(
                styles.panel__divider_left__listTitleWrapper__title,
                styles.panel__divider_left__listTitleWrapper__subTitle
              )} data-l10n-id='moneyAddSubTitle' />
            </div>
          </div>
        </div>
        <div className={css(styles.panel__divider, styles.panel__divider_right)}>
          <div data-l10n-id='coinbaseNotAvailable' />
        </div>
      </div>
    }
  }
  exchangePanel () {
    const url = this.props.ledgerData.getIn(['exchangeInfo', 'exchangeURL'])
    const name = this.props.ledgerData.getIn(['exchangeInfo', 'exchangeName'])
    // Call worldWidePanel if we don't have the URL or Name
    if (!url || !name) {
      return this.worldWidePanel()
    } else {
      return <div className={css(styles.panel, styles.panel__coinbase)}>
        <div className={css(styles.panel__divider, styles.panel__divider_left)}>
          <div className={css(styles.panel__divider_left__titleWrapper)}>
            <div className={css(styles.panel__divider_left__titleWrapper__iconWrapper)}>
              {this.faCreditCard()}
            </div>
            <div className={css(styles.panel__divider_left__listTitleWrapper)}>
              <div className={css(styles.panel__divider_left__listTitleWrapper__title)} data-l10n-id='outsideUSAPayment' />
            </div>
          </div>
        </div>
        <div className={css(styles.panel__divider, styles.panel__divider_right)}>
          <a target='_blank' href={url}>
            {/* TODO: refactor button.js */}
            <Button className={cx({
              primaryButton: true,
              [css(styles.panelButton)]: true
            })}
              testId='exchangePanelButton'
              label={name}
            />
          </a>
        </div>
      </div>
    }
  }
  worldWidePanel () {
    return <div className={css(styles.panel)}>
      <div className={css(styles.panel__divider, styles.panel__divider_left)}>
        <div className={css(styles.panel__divider_left__titleWrapper)}>
          <div className={css(styles.panel__divider_left__titleWrapper__iconWrapper)}>
            {this.faCreditCard()}
          </div>
          <div className={css(styles.panel__divider_left__listTitleWrapper)}>
            <div className={css(styles.panel__divider_left__listTitleWrapper__title)} data-l10n-id='outsideUSAPayment' />
          </div>
        </div>
      </div>
      <div className={css(styles.panel__divider, styles.panel__divider_right)}>
        <a target='_blank' href='https://www.buybitcoinworldwide.com/'>
          {/* TODO: refactor button.js */}
          <Button className={cx({
            primaryButton: true,
            [css(styles.panelButton)]: true
          })}
            testId='worldWidePanelButton'
            label='buybitcoinworldwide.com'
          />
        </a>
      </div>
    </div>
  }

  bitcoinPanel () {
    const ledgerData = this.props.ledgerData

    return <div className={css(styles.panel, styles.panel__bitcoinPanel)}>
      <div className={css(styles.panel__divider, styles.panel__divider_left)}>
        <div className={css(styles.panel__divider_left__titleWrapper)}>
          <div className={css(styles.panel__divider_left__titleWrapper__iconWrapper)}>
            {this.faBitcoin()}
          </div>
          <div className={css(styles.panel__divider_left__listTitleWrapper)}>
            <div className={css(styles.panel__divider_left__listTitleWrapper__title)} data-l10n-id='bitcoinAdd' />
            <div className={css(
              styles.panel__divider_left__listTitleWrapper__title,
              styles.panel__divider_left__listTitleWrapper__subTitle
            )} data-l10n-id='bitcoinAddDescription' />
          </div>
        </div>
      </div>
      {
        ledgerData.get('address')
          ? <div className={css(styles.panel__divider, styles.panel__divider_right)}>
            {
              ledgerData.get('hasBitcoinHandler') && ledgerData.get('paymentURL')
                ? <div className={css(styles.panel__divider_right__bitcoinPanel__paymentURL)}>
                  <a href={ledgerData.get('paymentURL')} target='_blank'>
                    {/* TODO: refactor button.js */}
                    <Button className={cx({
                      primaryButton: true,
                      [css(styles.panelButton)]: true
                    })}
                      l10nId='bitcoinVisitAccount'
                      testId='bitcoinVisitAccountButton'
                    />
                  </a>
                </div>
                : null
            }
            <div data-l10n-id='bitcoinPaymentURL' className={css(styles.panel__divider_right__bitcoinPanel__walletLabelText)} />
            <div className={css(styles.panel__divider_right__bitcoinPanel__walletAddressText)}>{ledgerData.get('address')}</div>
            {/* TODO: refactor button.js */}
            <Button className={cx({
              primaryButton: true,
              [css(styles.panelButton)]: true
            })}
              l10nId='copyToClipboard'
              testId='copyToClipboardButton'
              onClick={this.copyToClipboard.bind(this, ledgerData.get('address'))}
            />
          </div>
          : <div className={css(styles.panel__divider, styles.panel__divider_right)}>
            <div data-l10n-id='bitcoinWalletNotAvailable' />
          </div>
      }
    </div>
  }

  smartphonePanel () {
    return <div className={css(styles.panel, styles.panel__smartphonePanel)}>
      <div className={css(styles.panel__divider, styles.panel__divider_left)}>
        <div className={css(
          styles.panel__divider_left__titleWrapper,
          styles.panel__divider_left__titleWrapper_noSubTitle
        )}>
          <div className={css(styles.panel__divider_left__titleWrapper__iconWrapper)}>
            {this.faSmartphone()}
          </div>
          <div className={css(styles.panel__divider_left__listTitleWrapper)}>
            <div className={css(styles.panel__divider_left__listTitleWrapper__title)} data-l10n-id='smartphoneTitle' />
          </div>
        </div>
      </div>
      <div className={css(styles.panel__divider, styles.panel__divider_right)}>
        {/* TODO: refactor button.js */}
        <Button className={cx({
          primaryButton: true,
          [css(styles.panelButton)]: true
        })}
          l10nId='displayQRCode'
          testId='displayQRCode'
          onClick={this.props.showQRcode.bind(this)}
        />
      </div>
    </div>
  }

  qrcodeOverlayContent () {
    return <div className={css(styles.modalOverlay__qrcodeOverlay__content)}>
      <img
        src={this.props.ledgerData.get('paymentIMG')}
        data-l10n-id='bitcoinQRImg'
      />
      <div className={css(styles.modalOverlay__qrcodeOverlay__content__bitcoinQR)}
        data-l10n-id='bitcoinQR'
      />
    </div>
  }
  qrcodeOverlayFooter () {
    if (coinbaseCountries.indexOf(this.props.ledgerData.get('countryCode')) > -1) {
      return <div className={css(styles.modalOverlay__qrcodeOverlay__footerWrapper__footer)}>
        <div className={css(styles.coinbaseLogo)} />
        <a target='_blank'
          className={css(
            styles.modalOverlay__qrcodeOverlay__footerWrapper__footer__qrcodeLogo,
            styles.modalOverlay__qrcodeOverlay__footerWrapper__footer__appstoreLogo
          )}
          href='https://itunes.apple.com/us/app/coinbase-bitcoin-wallet/id886427730?mt=8'
        />
        <a target='_blank'
          className={css(
            styles.modalOverlay__qrcodeOverlay__footerWrapper__footer__qrcodeLogo,
            styles.modalOverlay__qrcodeOverlay__footerWrapper__footer__playstoreLogo
          )}
          href='https://play.google.com/store/apps/details?id=com.coinbase.android'
        />
      </div>
    }
    return null
  }

  bitcoinOverlayContent () {
    return <iframe className={css(styles.modalOverlay__coinbaseOverlay__bodyWrapper__body__iframe)}
      src={this.props.ledgerData.get('buyURL')}
    />
  }

  copyToClipboard (text) {
    aboutActions.setClipboard(text)
  }

  onMessage (e) {
    if (!e.data || e.origin !== config.coinbaseOrigin) {
      return
    }
    if (e.data.event === 'modal_closed') {
      if (this.buyCompleted) {
        this.props.hideParentOverlay()
        this.buyCompleted = false
      } else {
        this.props.hideOverlay()
      }
    } else if (e.data.event === 'buy_completed') {
      this.buyCompleted = true
    }
  }

  render () {
    window.addEventListener('message', this.onMessage.bind(this), false)
    const ledgerData = this.props.ledgerData

    return <div data-test-id='bitcoinDashboard'>
      {
        this.props.bitcoinOverlayVisible
          ? <ModalOverlay
            title={'bitcoinBuy'}
            content={this.bitcoinOverlayContent()}
            customDialogClasses={css(styles.modalOverlay__coinbaseOverlay)}
            customDialogHeaderClasses={css(styles.modalOverlay__coinbaseOverlay__header)}
            customDialogBodyWrapperClasses={css(styles.modalOverlay__coinbaseOverlay__bodyWrapper)}
            customDialogBodyClasses={css(styles.modalOverlay__coinbaseOverlay__bodyWrapper__body)}
            customDialogFooterClasses={css(styles.modalOverlay__coinbaseOverlay__footer)}
            emptyDialog
            onHide={this.props.hideOverlay.bind(this)}
          />
          : null
      }
      {
        this.props.qrcodeOverlayVisible
          ? <ModalOverlay
            content={this.qrcodeOverlayContent()}
            customDialogClasses={css(styles.modalOverlay__qrcodeOverlay)}
            customDialogHeaderClasses={css(commonStyles.noPadding)}
            customDialogFooterClasses={css(
              commonStyles.noPadding,
              styles.modalOverlay__qrcodeOverlay__footerWrapper
            )}
            footer={this.qrcodeOverlayFooter()}
            onHide={this.props.hideQRcode.bind(this)}
          />
          : null
      }
      {
        (this.userInAmerica || ledgerData.get('buyURLFrame'))
          ? this.coinbasePanel()
          : this.exchangePanel()
      }
      {this.bitcoinPanel()}
      {this.smartphonePanel()}
    </div>
  }
}

class BitcoinDashboardFooter extends ImmutableComponent {
  get coinbaseCountries () {
    return coinbaseCountries.indexOf(this.props.ledgerData.get('countryCode')) > -1
  }

  get coinbaseMessageWrapper () {
    return <div className={css(styles.dashboardFooter_coinbaseFooter__coinbaseMessageWrapper)}>
      <div className={css(this.coinbaseCountries && styles.coinbaseLogo)} />
      <span className={css(styles.dashboardFooter_coinbaseFooter__coinbaseMessageWrapper__message)} data-l10n-id='coinbaseMessage' />
    </div>
  }

  render () {
    return <div className={css(
      styles.dashboardFooter,
      this.coinbaseCountries && styles.dashboardFooter_coinbaseFooter
    )}>
      {
        this.coinbaseCountries
          ? this.coinbaseMessageWrapper
          : null
      }
      <Button className={cx({
        whiteButton: true,
        [css(styles.dashboardFooter_coinbaseFooter__doneButton)]: this.coinbaseCountries
      })}
        l10nId='done'
        testId='panelDoneButton'
        onClick={this.props.hideParentOverlay}
      />
    </div>
  }
}

const qrcodeLogoWidth = '130.5px'
const qrcodeLogoHeight = '42.75px'
const panelPadding = '25px'
const panelPaddingBody = `calc(${panelPadding} - ${globalStyles.spacing.dialogInsideMargin})`
const iconWrapperWidth = '55px'

const styles = StyleSheet.create({
  faBitcoin: {
    color: 'white',
    transform: 'rotate(12deg)'
  },
  faCircle: {
    color: globalStyles.color.bitcoinOrange
  },
  faCreditCard: {
    fontSize: '30px'
  },
  faMobile: {
    fontSize: '50px'
  },

  coinbaseLogo: {
    width: '40px',
    height: '40px',
    display: 'inline-block',
    marginTop: '1px',
    marginRight: '10px',
    background: `url(${CoinBase}) 0 0 / contain no-repeat`
  },

  // TODO: Refactor button to remove !important
  panelButton: {
    minWidth: '180px !important'
  },

  panel: {
    display: 'flex'
  },
  panel__divider: {
    width: '50%',
    boxSizing: 'border-box',
    display: 'flex',
    flexFlow: 'column'
  },
  panel__divider_left: {
    alignItems: 'flex-start'
  },
  panel__divider_right: {
    alignItems: 'flex-end'
  },

  panel__divider_right__bitcoinPanel__walletLabelText: {
    fontSize: '1em',
    color: globalStyles.color.braveOrange,
    marginBottom: '5px'
  },
  panel__divider_right__bitcoinPanel__walletAddressText: {
    fontSize: '13px',
    color: 'black',
    marginBottom: globalStyles.spacing.dialogInsideMargin,
    cursor: 'initial',
    userSelect: 'initial'
  },
  panel__divider_right__bitcoinPanel__paymentURL: {
    marginBottom: globalStyles.spacing.dialogInsideMargin
  },

  panel__divider_left__titleWrapper: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  panel__divider_left__titleWrapper_noSubTitle: {
    alignItems: 'center'
  },
  panel__divider_left__titleWrapper__iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: iconWrapperWidth
  },
  panel__divider_left__listTitleWrapper: {
    maxWidth: `calc(100% - ${iconWrapperWidth})`
  },
  panel__divider_left__listTitleWrapper__title: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: '15px'
  },
  panel__divider_left__listTitleWrapper__subTitle: {
    fontWeight: 'normal',
    fontSize: '14px',
    fontStyle: 'italic',
    lineHeight: '1.3em',
    marginTop: globalStyles.spacing.dialogInsideMargin
  },
  panel__divider_right__title: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: '15px'
  },
  panel__divider_right__subTitle: {
    fontWeight: 'normal',
    fontSize: '14px',
    fontStyle: 'italic',
    lineHeight: '1.3em',
    marginTop: globalStyles.spacing.dialogInsideMargin
  },

  panel__coinbase: {
    background: 'initial',
    padding: `${panelPaddingBody} 0 ${panelPadding}`,
    borderBottom: `3px solid ${globalStyles.color.modalLightGray}`
  },
  panel__bitcoinPanel: {
    padding: `${panelPadding} 0`,
    borderBottom: `3px solid ${globalStyles.color.modalLightGray}`
  },
  panel__smartphonePanel: {
    padding: `${panelPadding} 0 ${panelPaddingBody}`
  },

  modalOverlay__qrcodeOverlay: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: 0,
    width: '350px',
    height: '350px',
    margin: '100px auto 0 auto',
    background: '#fff'
  },
  modalOverlay__qrcodeOverlay__content: {
    textAlign: 'center'
  },
  modalOverlay__qrcodeOverlay__content__bitcoinQR: {
    color: globalStyles.color.braveOrange
  },
  modalOverlay__qrcodeOverlay__footerWrapper: {
    width: '100%'
  },
  modalOverlay__qrcodeOverlay__footerWrapper__footer: {
    display: 'flex',
    justifyContent: 'center',
    background: globalStyles.color.gray,
    padding: '15px 0',
    width: '100%'
  },
  modalOverlay__qrcodeOverlay__footerWrapper__footer__qrcodeLogo: {
    width: qrcodeLogoWidth,
    height: qrcodeLogoHeight,
    display: 'inline-block'
  },
  modalOverlay__qrcodeOverlay__footerWrapper__footer__appstoreLogo: {
    background: `url(${IOS})`,
    backgroundSize: `${qrcodeLogoWidth} ${qrcodeLogoHeight}`,
    marginRight: '5px'
  },
  modalOverlay__qrcodeOverlay__footerWrapper__footer__playstoreLogo: {
    background: `url(${Andorid})`,
    backgroundSize: `${qrcodeLogoWidth} ${qrcodeLogoHeight}`
  },

  modalOverlay__coinbaseOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    padding: 0,
    margin: 0,
    border: 0,
    borderRadius: 0,
    background: 'transparent',
    boxShadow: 'none'
  },
  modalOverlay__coinbaseOverlay__header: {
    padding: 0
  },
  modalOverlay__coinbaseOverlay__bodyWrapper: {
    height: '100%',
    width: '100%'
  },
  modalOverlay__coinbaseOverlay__bodyWrapper__body: {
    padding: 0,
    height: '100%',
    width: '100%',
    background: 'transparent'
  },
  modalOverlay__coinbaseOverlay__bodyWrapper__body__iframe: {
    display: 'block',
    width: '100%',
    height: '100%',
    border: 'none',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
  },
  modalOverlay__coinbaseOverlay__footer: {
    padding: 0
  },

  dashboardFooter: {
    fontSize: '13px',
    fontStyle: 'italic'
  },
  dashboardFooter_coinbaseFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  dashboardFooter_coinbaseFooter__coinbaseMessageWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  dashboardFooter_coinbaseFooter__coinbaseMessageWrapper__message: {
    display: 'inline-block',
    maxWidth: '450px'
  },
  dashboardFooter_coinbaseFooter__doneButton: {
    // TODO (Cezar): Remove !important once button components are refactored
    marginRight: '30px !important' // 20px + 30px -> align the done button with other panelButtons
  }
})

module.exports = {
  BitcoinDashboard,
  BitcoinDashboardFooter
}
