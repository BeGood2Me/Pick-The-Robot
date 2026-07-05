import type { MatchEvent, MatchEventHandler } from './types';

let eventHandler: MatchEventHandler | null = null;

export function setMatchEventHandler(handler: MatchEventHandler | null): void {
  eventHandler = handler;
}

export function emitMatchEvent(event: MatchEvent): void {
  eventHandler?.(event);
}
