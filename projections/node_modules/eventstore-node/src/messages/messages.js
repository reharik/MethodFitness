module.exports = require("protobufjs").newBuilder({})['import']({
    "package": "EventStore.Client.Messages",
    "messages": [
        {
            "name": "NewEvent",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "event_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_type",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "data_content_type",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "metadata_content_type",
                    "id": 4
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "data",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "metadata",
                    "id": 6
                }
            ]
        },
        {
            "name": "EventRecord",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "event_number",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "event_id",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_type",
                    "id": 4
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "data_content_type",
                    "id": 5
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "metadata_content_type",
                    "id": 6
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "data",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "metadata",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "created",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "created_epoch",
                    "id": 10
                }
            ]
        },
        {
            "name": "ResolvedIndexedEvent",
            "fields": [
                {
                    /*
                     rule changed from required to optional
                     because protobufjs doesn't allow null value for required object
                     and in the case of a non-success result, event will be null
                    */
                    "rule": "optional",
                    "type": "EventRecord",
                    "name": "event",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "EventRecord",
                    "name": "link",
                    "id": 2
                }
            ]
        },
        {
            "name": "ResolvedEvent",
            "fields": [
                {
                    "rule": "required",
                    "type": "EventRecord",
                    "name": "event",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "EventRecord",
                    "name": "link",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "commit_position",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "prepare_position",
                    "id": 4
                }
            ]
        },
        {
            "name": "WriteEvents",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "expected_version",
                    "id": 2
                },
                {
                    "rule": "repeated",
                    "type": "NewEvent",
                    "name": "events",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "require_master",
                    "id": 4
                }
            ]
        },
        {
            "name": "WriteEventsCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "OperationResult",
                    "name": "result",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "first_event_number",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "last_event_number",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "prepare_position",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "commit_position",
                    "id": 6
                }
            ]
        },
        {
            "name": "DeleteStream",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "expected_version",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "require_master",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "hard_delete",
                    "id": 4
                }
            ]
        },
        {
            "name": "DeleteStreamCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "OperationResult",
                    "name": "result",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "prepare_position",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "commit_position",
                    "id": 4
                }
            ]
        },
        {
            "name": "TransactionStart",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "expected_version",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "require_master",
                    "id": 3
                }
            ]
        },
        {
            "name": "TransactionStartCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "transaction_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "OperationResult",
                    "name": "result",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 3
                }
            ]
        },
        {
            "name": "TransactionWrite",
            "fields": [
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "transaction_id",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "NewEvent",
                    "name": "events",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "require_master",
                    "id": 3
                }
            ]
        },
        {
            "name": "TransactionWriteCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "transaction_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "OperationResult",
                    "name": "result",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 3
                }
            ]
        },
        {
            "name": "TransactionCommit",
            "fields": [
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "transaction_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "require_master",
                    "id": 2
                }
            ]
        },
        {
            "name": "TransactionCommitCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "transaction_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "OperationResult",
                    "name": "result",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "first_event_number",
                    "id": 4
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "last_event_number",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "prepare_position",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "commit_position",
                    "id": 7
                }
            ]
        },
        {
            "name": "ReadEvent",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "event_number",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "resolve_link_tos",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "require_master",
                    "id": 4
                }
            ]
        },
        {
            "name": "ReadEventCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "ReadEventResult",
                    "name": "result",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "ResolvedIndexedEvent",
                    "name": "event",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "error",
                    "id": 3
                }
            ],
            "enums": [
                {
                    "name": "ReadEventResult",
                    "values": [
                        {
                            "name": "Success",
                            "id": 0
                        },
                        {
                            "name": "NotFound",
                            "id": 1
                        },
                        {
                            "name": "NoStream",
                            "id": 2
                        },
                        {
                            "name": "StreamDeleted",
                            "id": 3
                        },
                        {
                            "name": "Error",
                            "id": 4
                        },
                        {
                            "name": "AccessDenied",
                            "id": 5
                        }
                    ]
                }
            ]
        },
        {
            "name": "ReadStreamEvents",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "from_event_number",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "max_count",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "resolve_link_tos",
                    "id": 4
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "require_master",
                    "id": 5
                }
            ]
        },
        {
            "name": "ReadStreamEventsCompleted",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "ResolvedIndexedEvent",
                    "name": "events",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "ReadStreamResult",
                    "name": "result",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "next_event_number",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "last_event_number",
                    "id": 4
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "is_end_of_stream",
                    "id": 5
                },
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "last_commit_position",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "error",
                    "id": 7
                }
            ],
            "enums": [
                {
                    "name": "ReadStreamResult",
                    "values": [
                        {
                            "name": "Success",
                            "id": 0
                        },
                        {
                            "name": "NoStream",
                            "id": 1
                        },
                        {
                            "name": "StreamDeleted",
                            "id": 2
                        },
                        {
                            "name": "NotModified",
                            "id": 3
                        },
                        {
                            "name": "Error",
                            "id": 4
                        },
                        {
                            "name": "AccessDenied",
                            "id": 5
                        }
                    ]
                }
            ]
        },
        {
            "name": "ReadAllEvents",
            "fields": [
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "commit_position",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "prepare_position",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "max_count",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "resolve_link_tos",
                    "id": 4
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "require_master",
                    "id": 5
                }
            ]
        },
        {
            "name": "ReadAllEventsCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "commit_position",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "prepare_position",
                    "id": 2
                },
                {
                    "rule": "repeated",
                    "type": "ResolvedEvent",
                    "name": "events",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "next_commit_position",
                    "id": 4
                },
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "next_prepare_position",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "ReadAllResult",
                    "name": "result",
                    "id": 6,
                    "options": {
                        "default": "Success"
                    }
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "error",
                    "id": 7
                }
            ],
            "enums": [
                {
                    "name": "ReadAllResult",
                    "values": [
                        {
                            "name": "Success",
                            "id": 0
                        },
                        {
                            "name": "NotModified",
                            "id": 1
                        },
                        {
                            "name": "Error",
                            "id": 2
                        },
                        {
                            "name": "AccessDenied",
                            "id": 3
                        }
                    ]
                }
            ]
        },
        {
            "name": "CreatePersistentSubscription",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "subscription_group_name",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "resolve_link_tos",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "start_from",
                    "id": 4
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "message_timeout_milliseconds",
                    "id": 5
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "record_statistics",
                    "id": 6
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "live_buffer_size",
                    "id": 7
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "read_batch_size",
                    "id": 8
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "buffer_size",
                    "id": 9
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "max_retry_count",
                    "id": 10
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "prefer_round_robin",
                    "id": 11
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "checkpoint_after_time",
                    "id": 12
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "checkpoint_max_count",
                    "id": 13
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "checkpoint_min_count",
                    "id": 14
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "subscriber_max_count",
                    "id": 15
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "named_consumer_strategy",
                    "id": 16
                }
            ]
        },
        {
            "name": "DeletePersistentSubscription",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "subscription_group_name",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 2
                }
            ]
        },
        {
            "name": "UpdatePersistentSubscription",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "subscription_group_name",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "resolve_link_tos",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "start_from",
                    "id": 4
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "message_timeout_milliseconds",
                    "id": 5
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "record_statistics",
                    "id": 6
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "live_buffer_size",
                    "id": 7
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "read_batch_size",
                    "id": 8
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "buffer_size",
                    "id": 9
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "max_retry_count",
                    "id": 10
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "prefer_round_robin",
                    "id": 11
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "checkpoint_after_time",
                    "id": 12
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "checkpoint_max_count",
                    "id": 13
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "checkpoint_min_count",
                    "id": 14
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "subscriber_max_count",
                    "id": 15
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "named_consumer_strategy",
                    "id": 16
                }
            ]
        },
        {
            "name": "UpdatePersistentSubscriptionCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "UpdatePersistentSubscriptionResult",
                    "name": "result",
                    "id": 1,
                    "options": {
                        "default": "Success"
                    }
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "reason",
                    "id": 2
                }
            ],
            "enums": [
                {
                    "name": "UpdatePersistentSubscriptionResult",
                    "values": [
                        {
                            "name": "Success",
                            "id": 0
                        },
                        {
                            "name": "DoesNotExist",
                            "id": 1
                        },
                        {
                            "name": "Fail",
                            "id": 2
                        },
                        {
                            "name": "AccessDenied",
                            "id": 3
                        }
                    ]
                }
            ]
        },
        {
            "name": "CreatePersistentSubscriptionCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "CreatePersistentSubscriptionResult",
                    "name": "result",
                    "id": 1,
                    "options": {
                        "default": "Success"
                    }
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "reason",
                    "id": 2
                }
            ],
            "enums": [
                {
                    "name": "CreatePersistentSubscriptionResult",
                    "values": [
                        {
                            "name": "Success",
                            "id": 0
                        },
                        {
                            "name": "AlreadyExists",
                            "id": 1
                        },
                        {
                            "name": "Fail",
                            "id": 2
                        },
                        {
                            "name": "AccessDenied",
                            "id": 3
                        }
                    ]
                }
            ]
        },
        {
            "name": "DeletePersistentSubscriptionCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "DeletePersistentSubscriptionResult",
                    "name": "result",
                    "id": 1,
                    "options": {
                        "default": "Success"
                    }
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "reason",
                    "id": 2
                }
            ],
            "enums": [
                {
                    "name": "DeletePersistentSubscriptionResult",
                    "values": [
                        {
                            "name": "Success",
                            "id": 0
                        },
                        {
                            "name": "DoesNotExist",
                            "id": 1
                        },
                        {
                            "name": "Fail",
                            "id": 2
                        },
                        {
                            "name": "AccessDenied",
                            "id": 3
                        }
                    ]
                }
            ]
        },
        {
            "name": "ConnectToPersistentSubscription",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "subscription_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "allowed_in_flight_messages",
                    "id": 3
                }
            ]
        },
        {
            "name": "PersistentSubscriptionAckEvents",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "subscription_id",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "processed_event_ids",
                    "id": 2
                }
            ]
        },
        {
            "name": "PersistentSubscriptionNakEvents",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "subscription_id",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "processed_event_ids",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "NakAction",
                    "name": "action",
                    "id": 4,
                    "options": {
                        "default": "Unknown"
                    }
                }
            ],
            "enums": [
                {
                    "name": "NakAction",
                    "values": [
                        {
                            "name": "Unknown",
                            "id": 0
                        },
                        {
                            "name": "Park",
                            "id": 1
                        },
                        {
                            "name": "Retry",
                            "id": 2
                        },
                        {
                            "name": "Skip",
                            "id": 3
                        },
                        {
                            "name": "Stop",
                            "id": 4
                        }
                    ]
                }
            ]
        },
        {
            "name": "PersistentSubscriptionConfirmation",
            "fields": [
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "last_commit_position",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "subscription_id",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "last_event_number",
                    "id": 3
                }
            ]
        },
        {
            "name": "PersistentSubscriptionStreamEventAppeared",
            "fields": [
                {
                    "rule": "required",
                    "type": "ResolvedIndexedEvent",
                    "name": "event",
                    "id": 1
                }
            ]
        },
        {
            "name": "SubscribeToStream",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "event_stream_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "resolve_link_tos",
                    "id": 2
                }
            ]
        },
        {
            "name": "SubscriptionConfirmation",
            "fields": [
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "last_commit_position",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "last_event_number",
                    "id": 2
                }
            ]
        },
        {
            "name": "StreamEventAppeared",
            "fields": [
                {
                    "rule": "required",
                    "type": "ResolvedEvent",
                    "name": "event",
                    "id": 1
                }
            ]
        },
        {
            "name": "UnsubscribeFromStream",
            "fields": []
        },
        {
            "name": "SubscriptionDropped",
            "fields": [
                {
                    "rule": "optional",
                    "type": "SubscriptionDropReason",
                    "name": "reason",
                    "id": 1,
                    "options": {
                        "default": "Unsubscribed"
                    }
                }
            ],
            "enums": [
                {
                    "name": "SubscriptionDropReason",
                    "values": [
                        {
                            "name": "Unsubscribed",
                            "id": 0
                        },
                        {
                            "name": "AccessDenied",
                            "id": 1
                        },
                        {
                            "name": "NotFound",
                            "id": 2
                        },
                        {
                            "name": "PersistentSubscriptionDeleted",
                            "id": 3
                        },
                        {
                            "name": "SubscriberMaxCountReached",
                            "id": 4
                        }
                    ]
                }
            ]
        },
        {
            "name": "NotHandled",
            "fields": [
                {
                    "rule": "required",
                    "type": "NotHandledReason",
                    "name": "reason",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "additional_info",
                    "id": 2
                }
            ],
            "messages": [
                {
                    "name": "MasterInfo",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "external_tcp_address",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "external_tcp_port",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "external_http_address",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "external_http_port",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "external_secure_tcp_address",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "external_secure_tcp_port",
                            "id": 6
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "NotHandledReason",
                    "values": [
                        {
                            "name": "NotReady",
                            "id": 0
                        },
                        {
                            "name": "TooBusy",
                            "id": 1
                        },
                        {
                            "name": "NotMaster",
                            "id": 2
                        }
                    ]
                }
            ]
        },
        {
            "name": "ScavengeDatabase",
            "fields": []
        },
        {
            "name": "ScavengeDatabaseCompleted",
            "fields": [
                {
                    "rule": "required",
                    "type": "ScavengeResult",
                    "name": "result",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "error",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "total_time_ms",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "int64",
                    "name": "total_space_saved",
                    "id": 4
                }
            ],
            "enums": [
                {
                    "name": "ScavengeResult",
                    "values": [
                        {
                            "name": "Success",
                            "id": 0
                        },
                        {
                            "name": "InProgress",
                            "id": 1
                        },
                        {
                            "name": "Failed",
                            "id": 2
                        }
                    ]
                }
            ]
        }
    ],
    "enums": [
        {
            "name": "OperationResult",
            "values": [
                {
                    "name": "Success",
                    "id": 0
                },
                {
                    "name": "PrepareTimeout",
                    "id": 1
                },
                {
                    "name": "CommitTimeout",
                    "id": 2
                },
                {
                    "name": "ForwardTimeout",
                    "id": 3
                },
                {
                    "name": "WrongExpectedVersion",
                    "id": 4
                },
                {
                    "name": "StreamDeleted",
                    "id": 5
                },
                {
                    "name": "InvalidTransaction",
                    "id": 6
                },
                {
                    "name": "AccessDenied",
                    "id": 7
                }
            ]
        }
    ]
}).build();