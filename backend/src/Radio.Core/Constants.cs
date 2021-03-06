﻿namespace Radio.Core
{
    public struct Constants
    {
        public const string SIGNALR_PATH = "/radioHub";

        public struct UnitOfWork
        {
            public const string TOP_LEVEL_LIFETIME_SCOPE_TAG = nameof(TOP_LEVEL_LIFETIME_SCOPE_TAG);
            public const string REQUEST_CONTEXT_UNIT_OF_WORK_KEY = nameof(REQUEST_CONTEXT_UNIT_OF_WORK_KEY);
        }

        public struct StringLengths
        {
            public const int SHORT_NAME = 64;
            public const int NAME = 256;
            public const int LONG_NAME = 1024;
        }

        public struct App
        {
            public const int NUMBER_OF_CURRENT_SONGS = 1;
            public const int NUMBER_OF_VOTING_CANDIDATES = 3;

            public const int TIME_BEFORE_START_OF_NEXT_SONG_IN_SECONDS = 10;
            public const int CROSSFADE_DURATION_IN_SECONDS = 5;

            public const int MIN_DURATION_IN_SECONDS = 30;
        }
    }
}
