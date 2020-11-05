import {
  ageOverEighteen,
  countryUsesPostalcode,
  countryUsesZipcode,
  required,
  requiredDOB,
  requiredZipCode
} from 'services/FormHelper'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Icon,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import {
  DateInputBox,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBox,
  SelectBoxUSState,
  TextBox
} from 'components/Form'
import { defaultTo, map, replace } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { Props as OwnProps, SuccessStateType } from '.'

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
  color: ${props => props.theme.grey900};
`
const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

export const FullNameContainer = styled.div`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`

export const CaptionContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
`
export const Caption = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${props => props.theme.grey600};
`
const SmallFormItem = styled(FormItem)`
  width: 45%;
`

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const LeftTopCol = styled.div`
  display: flex;
  align-items: center;
`

const ErrorTextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`
const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${props => props.theme.red000};
  color: ${props => props.theme.red800};
  margin-bottom: 16px;
`
const getCountryElements = countries => [
  {
    group: '',
    items: map(
      country => ({
        value: country,
        text: country.name
      }),
      countries
    )
  }
]

const addTrailingZero = string => (string.length >= 2 ? string : `0${string}`)
const removeTrailingZero = replace(/^0/, '')
const objectToDOB = ({ date = '', month = '', year = '' }) =>
  `${year}-${month}-${addTrailingZero(date)}`
const DOBToObject = value => {
  const [year = '', month = '', date = ''] = defaultTo('', value).split('-')
  return {
    date: removeTrailingZero(date),
    month,
    year
  }
}
const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  if (!props.formValues) return null

  const disabled = props.invalid || props.submitting

  if (props.submitting) {
    return (
      <SpinnerWrapper>
        <SpinningLoader />
      </SpinnerWrapper>
    )
  }

  const countryCode = props.formValues.country
  const countryIsUS = countryCode === 'US'
  const countryUsesZipOrPostcode =
    countryUsesZipcode(countryCode) || countryUsesPostalcode(countryCode)
  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper style={{ paddingBottom: '0px', borderBottom: 'grey000' }}>
        <TopText color='grey800' size='20px' weight={600}>
          <LeftTopCol>
            <Icon
              cursor
              data-e2e='sbBackToCryptoSelection'
              name='arrow-left'
              size='20px'
              color='grey600'
              role='button'
              style={{ marginRight: '8px' }}
              onClick={() =>
                props.simpleBuyActions.setStep({
                  step: 'ENTER_AMOUNT',
                  orderType: props.orderType,
                  cryptoCurrency: props.cryptoCurrency,
                  fiatCurrency: props.fiatCurrency || 'USD',
                  pair: props.pair
                })
              }
            />
            <FormattedMessage
              id='modals.simplebuy.info_and_residential.title'
              defaultMessage='Info & Residential Address'
            />
          </LeftTopCol>
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={() => props.handleClose()}
          />
        </TopText>
      </FlyoutWrapper>
      <FlyoutWrapper style={{ paddingTop: '36px' }}>
        {props.error && (
          <ErrorTextContainer>
            <ErrorText>
              <Icon
                name='alert-filled'
                color='red600'
                style={{ marginRight: '4px' }}
              />
              Error: {props.error}
            </ErrorText>
          </ErrorTextContainer>
        )}
        <FormGroup>
          <FullNameContainer>
            <SmallFormItem>
              <Label htmlFor='firstName'>
                <Text weight={500} size='14px' color='grey900'>
                  <FormattedMessage
                    id='identityverification.personal.firstnamerequired'
                    defaultMessage='First Name *'
                  />
                </Text>
              </Label>
              <Field
                date-e2e='firstName'
                name='firstName'
                validate={required}
                component={TextBox}
                errorBottom
              />
            </SmallFormItem>
            <SmallFormItem>
              <Label htmlFor='lastName'>
                <Text weight={500} size='14px' color='grey900'>
                  <FormattedMessage
                    id='identityverification.personal.lastnamerequired'
                    defaultMessage='Last Name *'
                  />
                </Text>
              </Label>
              <Field
                date-e2e='lastName'
                name='lastName'
                validate={required}
                component={TextBox}
                errorBottom
              />
            </SmallFormItem>
          </FullNameContainer>
          <Caption>
            <FormattedMessage
              id='modals.simplebuy.info_and_residential.id_or_password'
              defaultMessage='As shown on your government issued ID or Passport'
            />
          </Caption>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <Label htmlFor='dob'>
              <Text weight={500} size='14px' color='grey900'>
                <FormattedMessage
                  id='identityverification.personal.dateofbirthrequired'
                  defaultMessage='Date of Birth *'
                />
              </Text>
            </Label>
            <Field
              name='dob'
              validate={[requiredDOB, ageOverEighteen]}
              component={DateInputBox}
              fullwidth
              label
              errorBottom
              countryIsUS={countryIsUS}
              parse={objectToDOB}
              format={DOBToObject}
            />
          </FormItem>

          <CaptionContainer>
            <Icon name='info' />
            <Caption>
              <FormattedMessage
                id='modals.simplebuy.info_and_residential.dob_caption'
                defaultMessage='You must be 18 years of age or older to Buy Crypto.'
              />
            </Caption>
          </CaptionContainer>
        </FormGroup>

        <FormGroup>
          <FormItem>
            <Label htmlFor='line1'>
              <Text weight={500} size='14px' color='grey900'>
                {countryIsUS ? (
                  <FormattedMessage
                    id='identityverification.personal.address_line1required'
                    defaultMessage='Address Line 1 *'
                  />
                ) : (
                  <FormattedMessage
                    id='identityverification.personal.streetline1required'
                    defaultMessage='Street Line 1 *'
                  />
                )}
              </Text>
            </Label>
            <Field
              name='line1'
              errorBottom
              validate={required}
              component={TextBox}
            />
          </FormItem>
        </FormGroup>

        <FormGroup>
          <FormItem>
            <Label htmlFor='line2'>
              <Text weight={500} size='14px' color='grey900'>
                {countryIsUS ? (
                  <FormattedMessage
                    id='identityverification.personal.address_line2'
                    defaultMessage='Address Line 2'
                  />
                ) : (
                  <FormattedMessage
                    id='identityverification.personal.streetline2'
                    defaultMessage='Street Line 2'
                  />
                )}
              </Text>
            </Label>
            <Field name='line2' errorBottom component={TextBox} />
          </FormItem>
        </FormGroup>

        <FormGroup>
          <FormItem>
            <Label htmlFor='city'>
              <Text weight={500} size='14px' color='grey900'>
                <FormattedMessage
                  id='identityverification.personal.cityrequired'
                  defaultMessage='City *'
                />
              </Text>
            </Label>
            <Field
              name='city'
              errorBottom
              validate={required}
              component={TextBox}
            />
          </FormItem>
        </FormGroup>
        <FormGroup inline>
          <FormItem>
            <FormLabel>
              {countryIsUS ? (
                <FormattedMessage
                  id='identityverification.personal.staterequired'
                  defaultMessage='State *'
                />
              ) : (
                <FormattedMessage
                  id='identityverification.personal.region'
                  defaultMessage='Region'
                />
              )}
            </FormLabel>
            {countryIsUS ? (
              <Field
                name='state'
                component={SelectBoxUSState}
                errorBottom
                validate={[required]}
                normalize={val => val.name}
              />
            ) : (
              <Field name='state' component={TextBox} />
            )}
          </FormItem>
          {countryUsesZipOrPostcode && (
            <SmallFormItem>
              <Label htmlFor='postCode'>
                <Text weight={500} size='14px' color='grey900'>
                  {countryUsesZipcode(countryCode) ? (
                    <FormattedMessage
                      id='identityverification.personal.zip'
                      defaultMessage='Zip Code *'
                    />
                  ) : (
                    <FormattedMessage
                      id='identityverification.personal.postcoderequired'
                      defaultMessage='Postcode *'
                    />
                  )}
                </Text>
              </Label>
              <Field
                name='postCode'
                errorBottom
                validate={requiredZipCode}
                component={TextBox}
              />
            </SmallFormItem>
          )}
        </FormGroup>

        <FormGroup>
          <FormItem>
            <Label htmlFor='country'>
              <Text weight={500} size='14px' color='grey900'>
                <FormattedMessage
                  id='modals.simplebuy.info_and_residential.country'
                  defaultMessage='Country'
                />
              </Text>
            </Label>

            <Field
              data-e2e='selectCountryDropdown'
              name='country'
              validate={required}
              elements={getCountryElements(props.supportedCountries)}
              component={SelectBox}
              menuPlacement='auto'
              onChange={props.onCountrySelect}
              label={
                <FormattedMessage
                  id='components.selectboxcountry.label'
                  defaultMessage='Select country'
                />
              }
            />
          </FormItem>
        </FormGroup>
        <Button
          data-e2e='submitSBInforAndResidential'
          height='48px'
          size='16px'
          nature='primary'
          type='submit'
          fullwidth
          disabled={disabled}
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          )}
        </Button>
      </FlyoutWrapper>
    </CustomForm>
  )
}

export type Props = OwnProps &
  SuccessStateType & {
    onCountrySelect: (e, value) => void
  }

export default reduxForm<{}, Props>({
  form: 'simpleBuyInforAndResidential',
  destroyOnUnmount: false
})(Success)