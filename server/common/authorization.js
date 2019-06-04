'use strict'
import { User } from '../models/User'
import CanCan from 'cancan'
const cancan = new CanCan()
const { allow } = cancan

// allow(User, 'create', Page, (user, page) => user.attributes.role === 0)
// allow(User, 'edit', Page, (user, page) => user.attributes.role === 0)
allow(User, 'show', User, (user, userToShow) => user.id === userToShow.id)

// allow(User, 'create', Organization, (user, organization) => user.attributes.role === 0)
// allow(User, 'show', Organization, (user, organization) => user.attributes.role === 0)

// allow(User, 'create', OrganizationCategory, (user, organizationCategory) => user.attributes.role === 0)
// allow(User, 'show', OrganizationCategory, (user, organizationCategory) => user.attributes.role === 0)

// allow(User, 'create', Announcement)
// allow(User, 'destroy', Announcement)

export default cancan
