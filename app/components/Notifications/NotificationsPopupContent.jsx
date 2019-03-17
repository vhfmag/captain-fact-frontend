import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Link } from 'react-router'
import { themeGet } from 'styled-system'
import { Flex, Box } from '@rebass/grid'
import { translate } from 'react-i18next'
import { transparentize } from 'polished'

import { Clock } from 'styled-icons/fa-regular/Clock'

import StyledLink from '../StyledUtils/StyledLink'
import { TimeSince } from '../Utils/TimeSince'
import Container from '../StyledUtils/Container'
import { Span } from '../StyledUtils/Text'
import NotificationDetails from './NotificationDetails'
import { userNotificationsURL } from '../../lib/cf_routes'

const NotificationContainer = styled(({ hasBeenSeen, ...props }) => <Link {...props} />)`
  display: flex;
  padding: ${themeGet('space.2')};
  font-size: ${themeGet('fontSizes.6')};

  ${props => !props.hasBeenSeen
    && css`
      background: ${transparentize(0.95, themeGet('colors.primary')(props))};
    `}

  &:hover {
    background: ${themeGet('colors.black.50')};
  }
`

/**
 * The content of the notification popup displayed when clicking on the top-right
 * bell in navbar.
 */
const NotificationsPopupContent = ({ user, notifications, markAsSeen, t }) => {
  const hasUnseen = notifications.find(n => !n.seenAt)
  return (
    <Flex flexDirection="column" alignItems="center">
      <Container
        display="flex"
        justifyContent="space-between"
        width={1}
        p={2}
        borderBottom="1px solid"
        borderColor="black.100"
      >
        <Span fontWeight="bold">Notifications</Span>
        <StyledLink
          disabled={!hasUnseen}
          onClick={() => markAsSeen(notifications.map(n => n.id), true)}
        >
          {t('markAllAsRead')}
        </StyledLink>
      </Container>
      {notifications.length === 0 ? (
        <Box p={4}>{t('empty')}</Box>
      ) : (
        <React.Fragment>
          <Container maxHeight={450} style={{ overflowY: 'auto' }}>
            {notifications.map(n => (
              <NotificationDetails key={n.id} notification={n}>
                {({ message, seenAt, insertedAt, link }) => (
                  <NotificationContainer
                    to={link}
                    onClick={() => markAsSeen(n.id, true)}
                    hasBeenSeen={Boolean(seenAt)}
                  >
                    <Flex flexDirection="column">
                      <Span color="black.400" mb={1}>
                        {message}
                      </Span>
                      <Span color="black.300">
                        <Clock size="1em" />
                        &nbsp;
                        <TimeSince time={insertedAt} />
                      </Span>
                    </Flex>
                  </NotificationContainer>
                )}
              </NotificationDetails>
            ))}
          </Container>
          <Container
            p={2}
            width={1}
            textAlign="center"
            boxShadow="0 -5px 15px -5px #f4f4f4"
            borderTop="1px solid #f4f4f4"
          >
            <Link to={userNotificationsURL(user)}>{t('seeAll')}</Link>
          </Container>
        </React.Fragment>
      )}
    </Flex>
  )
}

NotificationsPopupContent.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
  markAsSeen: PropTypes.func.isRequired
}

export default translate('notifications')(NotificationsPopupContent)
