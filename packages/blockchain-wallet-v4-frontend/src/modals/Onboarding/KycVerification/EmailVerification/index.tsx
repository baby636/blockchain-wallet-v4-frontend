import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { VerifyEmailFormValuesType } from 'data/types'

import { getData } from './selectors'
import Loading from '../template.loading'
import Success from './template.success'

const { VERIFY_EMAIL_FORM } = model.components.identityVerification

class VerifyEmail extends PureComponent<Props> {
  componentDidMount () {
    const { isEmailVerified, settingsActions } = this.props
    if (!isEmailVerified) {
      settingsActions.fetchSettings()
    }
  }

  handleSubmit = () => {
    const {
      securityCenterActions,
      settingsActions,
      identityVerificationActions,
      formValues
    } = this.props
    if (formValues) {
      identityVerificationActions.updateEmail(formValues.email)
      securityCenterActions.resendVerifyEmail(formValues.email)
      settingsActions.setEmail(formValues.email)
    }
  }

  onResendEmail = (email: string) => {
    const { securityCenterActions } = this.props
    securityCenterActions.resendVerifyEmail(email)
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          resendEmail={this.onResendEmail}
          onSubmit={this.handleSubmit}
        />
      ),
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  isEmailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(false),
  formValues: selectors.form.getFormValues(VERIFY_EMAIL_FORM)(state) as
    | VerifyEmailFormValuesType
    | undefined
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  ),
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export default connector(VerifyEmail)
