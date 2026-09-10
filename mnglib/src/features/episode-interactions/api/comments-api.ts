import { http, isMockMode, mockDelay } from "@shared/api";

import type { EpisodeComment } from "../model/types";
import * as commentsMocks from "./mock-comments";

export const commentsApi = {
  async getEpisodeComments(episodeId: number): Promise<EpisodeComment[]> {
    if (isMockMode()) {
      await mockDelay();
      return commentsMocks.getEpisodeComments();
    }
    return http.get<EpisodeComment[]>(`/episodes/${episodeId}/comments`);
  },
};
