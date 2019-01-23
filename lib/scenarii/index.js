'use strict'

/**
* Asterism plugin library / Scenarii plugin
*
* The scenarii subpackage is a module that exports all its components, nothing more.
* So you can use one of its component importing it in a destructuring way:
*
* @example
* import { Scenarii } from "asterism-plugin-library"
* const { ServerAction, ActionsDropdown } = Scenarii
*
* @module asterism-plugin-library/scenarii
*/

import ServerAction from './server-action'
import BrowserAction from './browser-action'

import ServerState from './server-state'
import BrowserState from './browser-state'

import ServerCondition from './server-condition'
import BrowserCondition from './browser-condition'

import ServerTrigger from './server-trigger'
import BrowserTrigger from './browser-trigger'

import ServerScenario from './server-scenario'
import BrowserScenario from './browser-scenario'

import ActionsDropdown from './actions-dropdown'
import TriggersDropdown from './triggers-dropdown'
import ConditionsDropdown from './conditions-dropdown'
import StatesDropdown from './states-dropdown'
import ScenariiDropdown from './scenarii-dropdown'

export default {
  ServerAction,
  BrowserAction,
  ServerState,
  BrowserState,
  ServerCondition,
  BrowserCondition,
  ServerTrigger,
  BrowserTrigger,
  ServerScenario,
  BrowserScenario,
  ActionsDropdown,
  TriggersDropdown,
  ConditionsDropdown,
  StatesDropdown,
  ScenariiDropdown
}
