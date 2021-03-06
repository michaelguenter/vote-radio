﻿using System;

namespace Radio.Infrastructure.Api.External.Dtos
{
    public class VotingCandidateDto
    {
        public Guid SongId { get; set; }

        public string Title { get; set; }

        public string Album { get; set; }

        public string Artist { get; set; }

        public Guid? CoverImageId { get; set; }

        public int VoteCount { get; set; }

        public bool IsActive { get; set; }
    }
}
