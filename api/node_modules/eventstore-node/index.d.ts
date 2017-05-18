/// <reference types="node" />
/// <reference types="Long" />

export class Position {
    constructor(commitPosition: number|Long, preparePosition: number|Long);
    readonly commitPosition: Long;
    readonly preparePosition: Long;
}

// Expose classes

export class UserCredentials {
    constructor(username: string, password: string);
    readonly username: string;
    readonly password: string;
}

export class PersistentSubscriptionSettings {
    constructor(resolveLinkTos: boolean, startFrom: number, extraStatistics: boolean, messageTimeout: number,
                maxRetryCount: number, liveBufferSize: number, readBatchSize: number, historyBufferSize: number,
                checkPointAfter: number, minCheckPointCount: number, maxCheckPointCount: number,
                maxSubscriberCount: number, namedConsumerStrategy: string)
    static create();
}

export namespace SystemConsumerStrategies {
    const DispatchToSingle: string;
    const RoundRobin: string;
    const Pinned: string
}

export class GossipSeed {
    constructor(endPoint: TcpEndPoint, hostHeader: string);
    readonly endPoint: TcpEndPoint;
    readonly hostHeader: string;
}

// Expose errors
export class WrongExpectedVersionError {
    readonly name: string;
    readonly action: string;
    readonly message: string;
    readonly stream?: string;
    readonly expectedVersion?: number;
    readonly transactionId?: Long;
}

export class StreamDeletedError {
    readonly message: string;
    readonly stream?: string;
    readonly transactionId?: Long;
}

export class AccessDeniedError {
    readonly name: string;
    readonly action: string;
    readonly message: string;
    readonly stream?: string;
    readonly transactionId?: Long;
}

// Expose enums/constants

export namespace expectedVersion {
    const any: number;
    const noStream: number;
    const emptyStream: number;
}

export namespace positions {
    const start: Position;
    const end: Position;
}

// systemMetadata
// eventReadStatus
// sliceReadStatus

// Expose loggers

export interface Logger {
    debug(fmt: string, ...args: any[]): void;
    info(fmt: string, ...args: any[]): void;
    error(fmt: string, ...args: any[]): void;
}

export class NoOpLogger implements Logger {
    constructor()
    debug(fmt: string, ...args: any[]): void;
    info(fmt: string, ...args: any[]): void;
    error(fmt: string, ...args: any[]): void;
}

export class FileLogger implements Logger {
    constructor(filePath: string, append: boolean);
    debug(fmt: string, ...args: any[]): void;
    info(fmt: string, ...args: any[]): void;
    error(fmt: string, ...args: any[]): void;
}

//

export interface WriteResult {
    readonly nextExpectedVersion: number;
    readonly logPosition: Position;
}

export interface RecordedEvent {
    readonly eventStreamId: string;
    readonly eventId: string;
    readonly eventNumber: number;
    readonly eventType: string;
    readonly createdEpoch: number;
    readonly data?: Buffer;
    readonly metadata?: Buffer;
    readonly isJson: boolean;
}

export interface ResolvedEvent {
    readonly event?: RecordedEvent;
    readonly link?: RecordedEvent;
    readonly originalEvent?: RecordedEvent;
    readonly isResolved: boolean;
    readonly originalPosition?: Position;
    readonly originalStreamId: string;
    readonly originalEventNumber: number;
}

export interface StreamEventsSlice {
    readonly status: string;        // TODO: enum
    readonly stream: string;
    readonly fromEventNumber: number;
    readonly readDirection: string; // TODO: enum
    readonly events: ResolvedEvent[];
    readonly nextEventNumber: number;
    readonly lastEventNumber: number;
    readonly isEndOfStream: boolean;
}

export interface AllEventsSlice {
    readonly readDirection: string; // TODO enum
    readonly fromPosition: Position;
    readonly nextPosition: Position;
    readonly events: ResolvedEvent[];
    readonly isEndOfStream: boolean;
}

export interface DeleteResult {
    readonly logPosition: Position;
}

export interface EventStoreTransaction {
    readonly transactionId: number;
    commit(): Promise<WriteResult>;
    write(eventOrEvents: EventData | EventData[]): Promise<void>;
    rollback(): void;
}

export interface EventReadResult {
    readonly status: string;
    readonly stream: string;
    readonly eventNumber: number;
    readonly event: ResolvedEvent | null;
}

export interface EventStoreSubscription {
    readonly isSubscribedToAll: boolean;
    readonly streamId: string;
    readonly lastCommitPosition: Position;
    readonly lastEventNumber: number;

    close(): void;
    unsubscribe(): void;
}

export interface EventStoreCatchUpSubscription {
    start(): void;
    stop(): void;
}

export interface RawStreamMetadataResult {
    readonly stream: string;
    readonly isStreamDeleted: boolean;
    readonly metastreamVersion: number;
    readonly streamMetadata: any;
}

// Callbacks
export interface EventAppearedCallback<TSubscription> {
    (subscription: TSubscription, event: ResolvedEvent): void;
}

export interface LiveProcessingStartedCallback {
    (subscription: EventStoreCatchUpSubscription): void;
}

export interface SubscriptionDroppedCallback<TSubscription> {
    (subscription: TSubscription, reason: string, error?: Error): void;
}

export interface TcpEndPoint {
    port: number;
    host: string;
}

export interface EventData {
    readonly eventId: string;
    readonly type: string;
    readonly isJson: boolean;
    readonly data: Buffer;
    readonly metadata: Buffer;
}

export interface EventStoreNodeConnection {
    connect(): Promise<void>;
    close(): void;
    // write actions
    deleteStream(stream: string, expectedVersion: number, hardDelete?: boolean, userCredentials?: UserCredentials): Promise<DeleteResult>;
    appendToStream(stream: string, expectedVersion: number, eventOrEvents: EventData | EventData[], userCredentials?: UserCredentials): Promise<WriteResult>;
    startTransaction(stream: string, expectedVersion: number, userCredentials?: UserCredentials): Promise<EventStoreTransaction>;
    continueTransaction(transactionId: number, userCredentials?: UserCredentials): EventStoreTransaction;
    // read actions
    readEvent(stream: string, eventNumber: number, resolveLinkTos?: boolean, userCredentials?: UserCredentials): Promise<EventReadResult>;
    readStreamEventsForward(stream: string, start: number, count: number, resolveLinkTos?: boolean, userCredentials?: UserCredentials): Promise<StreamEventsSlice>;
    readStreamEventsBackward(stream: string, start: number, count: number, resolveLinkTos?: boolean, userCredentials?: UserCredentials): Promise<StreamEventsSlice>;
    readAllEventsForward(position: Position, maxCount: number, resolveLinkTos?: boolean, userCredentials?: UserCredentials): Promise<AllEventsSlice>;
    readAllEventsBackward(position: Position, maxCount: number, resolveLinkTos?: boolean, userCredentials?: UserCredentials): Promise<AllEventsSlice>;
    // subscription actions
    subscribeToStream(stream: string, resolveLinkTos: boolean, eventAppeared: EventAppearedCallback<EventStoreSubscription>, subscriptionDropped?: SubscriptionDroppedCallback<EventStoreSubscription>, userCredentials?: UserCredentials): Promise<EventStoreSubscription>;
    subscribeToStreamFrom(stream: string, lastCheckpoint: number | null, resolveLinkTos: boolean, eventAppeared: EventAppearedCallback<EventStoreCatchUpSubscription>, liveProcessingStarted?: LiveProcessingStartedCallback, subscriptionDropped?: SubscriptionDroppedCallback<EventStoreCatchUpSubscription>, userCredentials?: UserCredentials, readBatchSize?: number): EventStoreCatchUpSubscription;
    subscribeToAll(resolveLinkTos: boolean, eventAppeared: EventAppearedCallback<EventStoreSubscription>, subscriptionDropped?: SubscriptionDroppedCallback<EventStoreSubscription>, userCredentials?: UserCredentials): Promise<EventStoreSubscription>;
    subscribeToAllFrom(lastCheckpoint: Position | null, resolveLinkTos: boolean, eventAppeared: EventAppearedCallback<EventStoreCatchUpSubscription>, liveProcessingStarted?: LiveProcessingStartedCallback, subscriptionDropped?: SubscriptionDroppedCallback<EventStoreCatchUpSubscription>, userCredentials?: UserCredentials, readBatchSize?: number): EventStoreCatchUpSubscription;
    // metadata actions
    setStreamMetadataRaw(stream: string, expectedMetastreamVersion: number, metadata: any, userCredentials?: UserCredentials): Promise<WriteResult>;
    getStreamMetadataRaw(stream: string, userCredentials?: UserCredentials): Promise<RawStreamMetadataResult>;

    on(event: "connected" | "disconnected" | "reconnecting" | "closed" | "error", listener: (arg: Error | string | TcpEndPoint) => void): this;
    once(event: "connected" | "disconnected" | "reconnecting" | "closed" | "error", listener: (arg: Error | string | TcpEndPoint) => void): this;
}

// Expose helper functions

export interface ConnectionSettings {
    log?: Logger,
    verboseLogging?: boolean,

    maxQueueSize?: number,
    maxConcurrentItems?: number,
    maxRetries?: number,
    maxReconnections?: number,

    requireMaster?: boolean,

    reconnectionDelay?: number,
    operationTimeout?: number,
    operationTimeoutCheckPeriod?: number,

    defaultUserCredentials?: UserCredentials,
    useSslConnection?: boolean,
    targetHost?: TcpEndPoint,
    validateServer?: boolean,

    failOnNoServerResponse?: boolean,
    heartbeatInterval?: number,
    heartbeatTimeout?: number,
    clientConnectionTimeout?: number,

    // Cluster Settings
    clusterDns?: string,
    maxDiscoverAttempts?: number,
    externalGossipPort?: number,
    gossipTimeout?: number
}

export function createConnection(settings: ConnectionSettings, endPointOrGossipSeed: string | TcpEndPoint | GossipSeed[], connectionName?: string): EventStoreNodeConnection;
export function createJsonEventData(eventId: string, event: any, metadata?: any, type?: string): EventData;
export function createEventData(eventId: string, type: string, isJson: boolean, data: Buffer, metadata?: Buffer): EventData;
