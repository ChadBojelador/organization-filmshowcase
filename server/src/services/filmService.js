const { buildGoogleDrivePlaybackUrls, extractGoogleDriveFileId } = require("../utils/googleDrive");
const { getSupabaseClient } = require("../supabase/client");
const { createHttpError } = require("../utils/httpError");

const fallbackFilms = [
  {
    id: "1201",
    title: "Sakripisyo",
    description: "A woman who quietly carrying more than she should. With her eyes closed and hands over her heart, she feels the weight of every sacrifice she\u2019s made. Above her, the falling figure reflects her pain and what she\u2019s had to let go of. Below, her parents, her family who remind us why she keeps going\u2014she endures for them. This is her story: choosing to give up parts of herself despite having her overwhelming struggles so the people she loves can live and have a better life.",
    thumbnailUrl: "/posters/1stYear_BSIT1201_SAKRIPISYO.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1BLTYP2s_R85kHK53l_GB62oZsEWvi7EX/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1BLTYP2s_R85kHK53l_GB62oZsEWvi7EX/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1BLTYP2s_R85kHK53l_GB62oZsEWvi7EX",
  },
  {
    id: "1202",
    title: "Sistema",
    description: "The system was never broken. It was built this way. A journalist who uncovers the truth\u2014straight to the heart of her own family. Set against a nation burdened by poverty, education inequality, environmental issues, mental health awareness, gender equality, and corruption, the film reveals how chaotic this world truly is \u2014 mirroring personal trauma, betrayal, and the societal issues that tear lives apart. When she finally faces the camera, the whole nation watches. She must choose between silence and resistance. But the real question is: will the truth be enough to break what was never meant to be fixed?",
    thumbnailUrl: "/posters/1stYear_BSIT1202_Sistema.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/19QQa0FP795E8fos0wDS_vTHxhtkpWUlB/preview",
    videoSourceUrl: "https://drive.google.com/file/d/19QQa0FP795E8fos0wDS_vTHxhtkpWUlB/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "19QQa0FP795E8fos0wDS_vTHxhtkpWUlB",
  },
  {
    id: "1203",
    title: "Tinnitus",
    description: "The poster for Tinnitus portrays a young woman fractured into multiple versions of herself, symbolizing emotional pressure, identity conflict, and inner struggle. The shattered glass effect reflects breaking points caused by expectations, grief, and unseen battles. It highlights themes of academic pressure, loss, and mental burden, alongside the silent fight to understand oneself and others. The dark tones emphasize isolation, while the contrasting expressions reveal vulnerability and strength. Ultimately, the poster represents how breaking can lead to healing, growth, and connection through shared struggles.",
    thumbnailUrl: "/posters/1stYear_BSIT-1203_TINNITUS.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1nxKx06biHwTE2CF4FwesM3LqGcHkIlnp/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1nxKx06biHwTE2CF4FwesM3LqGcHkIlnp/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1nxKx06biHwTE2CF4FwesM3LqGcHkIlnp",
  },
  {
    id: "1204",
    title: "Sagada",
    description: "Sagada is a story about love that is always there. It\u2019s about the kind of friendship that once felt permanent\u2014late laughs, shared dreams, and the belief that you\u2019d all make it together. But growing up has a way of pulling people apart, leaving conversations unfinished and feelings unsaid. At its heart, the film follows five friends learning that being there for others isn\u2019t always enough when no one stops to ask, \u201cKumusta ka?\u201d It\u2019s a story of unseen battles, of love expressed in small, fleeting ways, and of the weight of silence.",
    thumbnailUrl: "/posters/1stYear_ IT-1204_SAGADA.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1P3K1BK3oHBWlUPe-Pk5w7NYhkE_eCJYm/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1P3K1BK3oHBWlUPe-Pk5w7NYhkE_eCJYm/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1P3K1BK3oHBWlUPe-Pk5w7NYhkE_eCJYm",
  },
  {
    id: "1205",
    title: "Listahan",
    description: "Sila ang nagsusulat. Sila rin ang nagpapasya. This haunting short film centers on a blood-stained clipboard\u2014a lethal ledger for a \u201cResearch Initiative\u201d where names like Bernardo and Nena are marked, only to vanish or be found dead. Driven by a desperate need to fund his mother\u2019s kidney treatment, a young man unwittingly becomes the architect of this tragedy. Surrounded by grainy snapshots of trauma and looming, shadowy figures, the imagery captures a gritty world where a simple signature becomes a death warrant. Sino ang susunod na mabubura sa listahan?",
    thumbnailUrl: "/posters/1stYear_BSIT-1205_LISTAHAN.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1mnU5dml8sJDNbCWiz1E0_bMlNQGTc3qM/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1mnU5dml8sJDNbCWiz1E0_bMlNQGTc3qM/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1mnU5dml8sJDNbCWiz1E0_bMlNQGTc3qM",
  },
  {
    id: "1206",
    title: "Pangarap",
    description: "In a world where success is measured by lines of code and perfect percentages, a young man\u2019s aspirations become his greatest prison. Harvie is a high-achieving IT student living under the weight of his father\u2019s expectations\u2014treated more like a financial investment than a son. PANGARAP explores the dark intersection of academic burnout and mental health. It is a story of a dream that was never his own, and a cry for help that went unheard until the final \u201csystem exit.\u201d A poignant reminder that a person is not a machine, and a heart cannot be programmed.",
    thumbnailUrl: "/posters/1STYear_ IT-1206_ PANGARAP.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1xk_ZdDTJoLT9KaYpXsG5ygVbe8pdPyhQ/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1xk_ZdDTJoLT9KaYpXsG5ygVbe8pdPyhQ/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1xk_ZdDTJoLT9KaYpXsG5ygVbe8pdPyhQ",
  },
  {
    id: "1207",
    title: "The Equation of Us",
    description: "Inspired by the 100-peso bill, the poster uses \u20b1100 to represent the reality of living in poverty. It visually shows how \u201cthe equation of us\u201d is formed, with variables like time, trust, effort, and the greatest of all\u2014sacrifice\u2014clearly present in the design. Yet, one missing variable is left for the audience to discover, hinting at something that could break the entire equation. The two-headed figures facing opposite directions reflect conflicting perspectives, drawing viewers into a story that challenges what truly holds people together.",
    thumbnailUrl: "/posters/1st Year_BSIT-1207_THE EQUATION OF US.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/drive/folders/11yDx57PQYAIMFjbKXvFXho3UOTGC0FFz",
    videoSourceUrl: "https://drive.google.com/drive/folders/11yDx57PQYAIMFjbKXvFXho3UOTGC0FFz",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "11yDx57PQYAIMFjbKXvFXho3UOTGC0FFz",
  },
  {
    id: "1208",
    title: "To Do List",
    description: "Some memories heal you. Some memories keep you trapped. To-Do List: In Every Lifetime follows Noah, a man trapped in the shadows of grief after losing the person who once made his world feel alive. Haunted by memories and weighed down by loneliness, he struggles to find meaning in a life that no longer feels complete. Everything begins to change when he meets Iris \u2014 a mysterious girl whose warmth and presence slowly bring light back into his broken world. The poster reflects the film\u2019s central themes of grief, love, memory, and acceptance.",
    thumbnailUrl: "/posters/1st Year_BSIT-1208_TODOLIST.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1dvwH1N6TrUPVv0eFlXopdb8xi74nuxfg/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1dvwH1N6TrUPVv0eFlXopdb8xi74nuxfg/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1dvwH1N6TrUPVv0eFlXopdb8xi74nuxfg",
  },
  {
    id: "1209",
    title: "Kargada",
    description: "How would you rebuild a life full of false hopes? Jayson, the eldest of the family, full of dreams and dedicated to making their lives better, was forced to stop studying and be the breadwinner of the family. Just as he knew everything was going well, he learned that his whole family faced different issues on their own. Feeling the trap in his own cage, will he give it another chance for himself? Or still fight for what he wanted for his family? How would he rebuild a home he no longer knew existed?",
    thumbnailUrl: "/posters/1stYear_BSIT1209_Kargada.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/drive/folders/1xun8LXMXorTuoy3ZAAv7Iv2oSqx9GVu9",
    videoSourceUrl: "https://drive.google.com/drive/folders/1xun8LXMXorTuoy3ZAAv7Iv2oSqx9GVu9",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1xun8LXMXorTuoy3ZAAv7Iv2oSqx9GVu9",
  },
  {
    id: "1210",
    title: "Blessing in Blood",
    description: "The poster presents a dark and emotional atmosphere that reflects the film\u2019s serious message. The three characters sitting in a dim room symbolize family struggles, poverty, and emotional suffering. The faded smiling faces above them represent memories of happier times, creating a strong contrast with their painful reality. The cracked and shadowy effects add tension and sadness to the design. The red and white title symbolizes blood, sacrifice, and hope. The tagline emphasizes the importance of mental health awareness and reminds viewers that support and help should be given before situations become worse.",
    thumbnailUrl: "/posters/1stYear_IT-1210-BlessinginBlood.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/drive/folders/114a_eHaUmgCMlfn8gyiXSfHjHxx2bcdW",
    videoSourceUrl: "https://drive.google.com/drive/folders/114a_eHaUmgCMlfn8gyiXSfHjHxx2bcdW",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "114a_eHaUmgCMlfn8gyiXSfHjHxx2bcdW",
  },
  {
    id: "1211",
    title: "Balot Rutina",
    description: "The poster reflects the struggles of ordinary Filipinos living under corruption, poverty, and social injustice. At the center is Uno, writing in his diary, symbolizing the voice and realization of today\u2019s youth. The dark atmosphere and reflections represent hidden truths behind society\u2019s daily routine. The title suggests the endless cycle of hardship experienced by many families. Its tagline, \u201cAng bawat suhol ay isang patalim sa likod ng bayan,\u201d emphasizes the film\u2019s message about corruption, vote buying, and the consequences of remaining silent in the face of injustice.",
    thumbnailUrl: "/posters/1stYear_IT-1211-BalotRutina.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1KmJpuuC1XYOLSksPFEukUAfVLkZ19nSK/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1KmJpuuC1XYOLSksPFEukUAfVLkZ19nSK/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1KmJpuuC1XYOLSksPFEukUAfVLkZ19nSK",
  },
  {
    id: "1212",
    title: "Boses Papel",
    description: "Laban na para sa Lahat. Isang Liham upang Magbuhat. A woman raises her voice\u2014through ink, through paper\u2014against a system that refuses to listen. Set in a society weighed down by inequality, injustice, and silence, Boses Papel follows a journey where words become weapons and letters carry the weight of untold stories. Each line written is an act of resistance, each message a call to rise\u2014not just for oneself, but for everyone left unheard. As her voice begins to echo beyond the page, she is faced with a choice: remain within the safety of silence or fight for a truth that could shake everything.",
    thumbnailUrl: "/posters/1stYear_BSIT1212_BosesPapel.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/drive/folders/17iQ9LMTFveNSm1UpsgTE4CXCMtHy3CmY",
    videoSourceUrl: "https://drive.google.com/drive/folders/17iQ9LMTFveNSm1UpsgTE4CXCMtHy3CmY",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "17iQ9LMTFveNSm1UpsgTE4CXCMtHy3CmY",
  },
  {
    id: "1213",
    title: "Tuhog",
    description: "Ang salitang \u201cTuhog\u201d ay nagsisilbing isang masalimoot na lunduyan ng dalawang magkatunggaling mundo sa buhay ni Dante: ang marangal na pagsisikap at ang malupit na sining ng panlilinlang. Ito ay sumasalamin sa sistematikong pag-frame up sa kanya\u2014isang proseso kung saan ang kanyang dangal ay pilit na binubutas at \u201citinutuhog\u201d sa isang krimen na kailanman ay hindi niya ginawa. Ang double meaning ng \u201cTuhog\u201d ay isang masakit na paalala na sa mundong ito, ang sining na nagbibigay sa atin ng buhay ay maaari ring maging siya mismong instrumento ng ating pagbagsak kapag ang katotohanan ay pinalitan na ng manipulasyon.",
    thumbnailUrl: "/posters/1stYear_BSIT-1213_TUHOG.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1oxCihXUG82KvaO260ebU404cJ9VJmRwb/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1oxCihXUG82KvaO260ebU404cJ9VJmRwb/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1oxCihXUG82KvaO260ebU404cJ9VJmRwb",
  },
  {
    id: "1214",
    title: "Taya",
    description: "Taya is a story about the weight of a single decision. It\u2019s about a kuya who wanted to provide \u2014 who promised himself he would never become like his father, only to find himself destroying his family in a different way. At its heart, the film follows Lukas \u2014 a man caught between desperation and addiction \u2014 and Xana (Sana = Hope), the sister who never stopped believing in him. It\u2019s a story of how poverty doesn\u2019t just take money. It takes choices. It takes time. Sometimes, it takes the people we love. Taya asks the question: When you keep betting on a better tomorrow \u2014 what are you really losing today?",
    thumbnailUrl: "/posters/1stYear_ IT-1214_TAYA.png",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/1yH1kb0oiXcKOqFTLFY5VdYiCy4jXoAkz/preview",
    videoSourceUrl: "https://drive.google.com/file/d/1yH1kb0oiXcKOqFTLFY5VdYiCy4jXoAkz/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "1yH1kb0oiXcKOqFTLFY5VdYiCy4jXoAkz",
  },
  {
    id: "1215",
    title: "Mirage",
    description: "The poster for \u201cMirage\u201d features a powerful visual of a young woman whose head is distorted into a blurred, multi-faced streak, representing her fractured identity. The tagline, \u201cOne Face, A Thousand Life,\u201d underscores the theme of multiple personalities. This distortion illustrates the internal chaos of multiple personalities, suggesting that her identity is fluid and unstable. By focusing on her distorted features against a nationalistic backdrop, the image portrays the individual not just as a medical case, but as a human reflection of the complex social issues surrounding her.",
    thumbnailUrl: "/posters/1ST Year_BSIT-1215_Mirage.jpg",
    views: 0,
    releaseDate: "2026-05-01",
    videoEmbedUrl: "https://drive.google.com/file/d/13d_yuMnNIDwn7oBSElhWRaSmaj08KAKa/preview",
    videoSourceUrl: "https://drive.google.com/file/d/13d_yuMnNIDwn7oBSElhWRaSmaj08KAKa/view",
    videoSourceType: "embed",
    videoProvider: "google-drive",
    fileId: "13d_yuMnNIDwn7oBSElhWRaSmaj08KAKa",
  },
];

function mapFilmRowToDto(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    thumbnailUrl: row.thumbnail_url || "",
    releaseDate: row.release_date,
    views: row.views || 0,
    fileId: row.file_id || "",
    videoEmbedUrl: row.video_embed_url || "",
    videoSourceUrl: row.video_source_url || "",
    videoSourceType: row.video_source_type || "embed",
    videoProvider: row.video_provider || "google-drive",
    createdBy: row.created_by || "",
    createdAt: row.created_at,
  };
}

function mapFilmPayloadToInsertRow(payload, driveUrls) {
  return {
    title: payload.title,
    description: payload.description || "",
    release_date: payload.releaseDate || new Date().toISOString().slice(0, 10),
    views: payload.views || 0,
    thumbnail_url: payload.thumbnailUrl || driveUrls.thumbnailUrl,
    file_id: driveUrls.fileId,
    video_embed_url: driveUrls.videoEmbedUrl,
    video_source_url: driveUrls.videoSourceUrl,
    video_source_type: "embed",
    video_provider: "google-drive",
  };
}

function isMissingFilmsTable(error) {
  return error?.code === "42P01";
}

function mapSupabaseFilmError(error, fallbackMessage) {
  if (isMissingFilmsTable(error)) {
    return createHttpError(
      500,
      "Films table is missing in Supabase. Create a Films table before using /api/addFilm."
    );
  }

  return createHttpError(500, error?.message || fallbackMessage);
}

function resolveGoogleDriveUrls(payload) {
  const resolvedFileId = extractGoogleDriveFileId(payload.fileId) || extractGoogleDriveFileId(payload.googleDriveUrl);

  if (!resolvedFileId) {
    throw createHttpError(400, "Invalid Google Drive link or fileId.");
  }

  return buildGoogleDrivePlaybackUrls(resolvedFileId);
}

function requireSupabaseClient() {
  const client = getSupabaseClient();

  if (!client) {
    throw createHttpError(
      500,
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in server/.env."
    );
  }

  return client;
}

async function listFilms() {
  const client = getSupabaseClient();

  if (!client) {
    return fallbackFilms;
  }

  const { data, error } = await client
    .from("Films")
    .select(
      "id, title, description, thumbnail_url, release_date, views, file_id, video_embed_url, video_source_url, video_source_type, video_provider, created_by, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingFilmsTable(error)) {
      return fallbackFilms;
    }

    throw mapSupabaseFilmError(error, "Failed to load films.");
  }

  const persistedFilms = (data || []).map(mapFilmRowToDto);
  return persistedFilms.length ? persistedFilms : fallbackFilms;
}

async function createFilm(payload) {
  const client = requireSupabaseClient();

  const driveUrls = resolveGoogleDriveUrls(payload);
  const insertRow = mapFilmPayloadToInsertRow(payload, driveUrls);

  const { data, error } = await client
    .from("Films")
    .insert(insertRow)
    .select(
      "id, title, description, thumbnail_url, release_date, views, file_id, video_embed_url, video_source_url, video_source_type, video_provider, created_by, created_at"
    )
    .single();

  if (error) {
    throw mapSupabaseFilmError(error, "Failed to add film.");
  }

  return mapFilmRowToDto(data);
}

async function removeFilm(filmId) {
  const client = requireSupabaseClient();

  const { error } = await client
    .from("Films")
    .delete()
    .eq("id", filmId);

  if (error) {
    throw mapSupabaseFilmError(error, "Failed to delete film.");
  }
}

async function editFilm(filmId, payload) {
  const client = requireSupabaseClient();

  const updateFields = {};

  if (payload.title !== undefined) {
    updateFields.title = payload.title;
  }

  if (payload.description !== undefined) {
    updateFields.description = payload.description;
  }

  if (payload.thumbnailUrl !== undefined) {
    updateFields.thumbnail_url = payload.thumbnailUrl;
  }

  if (payload.releaseDate !== undefined) {
    updateFields.release_date = payload.releaseDate;
  }

  // If a new Google Drive URL or fileId is provided, re-resolve all drive URLs
  if (payload.fileId || payload.googleDriveUrl) {
    const driveUrls = resolveGoogleDriveUrls(payload);
    updateFields.file_id = driveUrls.fileId;
    updateFields.video_embed_url = driveUrls.videoEmbedUrl;
    updateFields.video_source_url = driveUrls.videoSourceUrl;
  }

  if (Object.keys(updateFields).length === 0) {
    throw createHttpError(400, "No fields to update.");
  }

  const { data, error } = await client
    .from("Films")
    .update(updateFields)
    .eq("id", filmId)
    .select(
      "id, title, description, thumbnail_url, release_date, views, file_id, video_embed_url, video_source_url, video_source_type, video_provider, created_by, created_at"
    )
    .single();

  if (error) {
    throw mapSupabaseFilmError(error, "Failed to update film.");
  }

  return mapFilmRowToDto(data);
}

module.exports = {
  listFilms,
  createFilm,
  removeFilm,
  editFilm,
};
