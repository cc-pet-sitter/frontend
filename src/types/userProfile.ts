export interface SitterProfile {
  id: number;
  aggregate_sitter_rating: number;
  profile_bio: string;
  bio_picture_src_list: string;
  sitter_house_ok: boolean;
  owner_house_ok: boolean;
  visit_ok: boolean;
  dogs_ok: boolean;
  cats_ok: boolean;
  fish_ok: boolean;
  birds_ok: boolean;
  rabbits_ok: boolean;
}

export interface AppUser {
  sitter_bio_picture_src_list: string | undefined;
  sitter_profile_bio: string;
  visit_ok: boolean;
  rabbits_ok: boolean;
  birds_ok: boolean;
  fish_ok: boolean;
  cats_ok: boolean;
  dogs_ok: boolean;
  profile_bio: string;
  bio_picture_src_list: string | undefined;
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  last_login: string;
  account_created: string;
  last_updated: string;
  profile_picture_src: string;
  prefecture: string;
  city_ward: string;
  street_address: string;
  postal_code: string;
  account_language: string;
  english_ok: boolean;
  japanese_ok: boolean;
  sitter_id: number | null;
  owner_id: number | null;
  sitter_profile: SitterProfile;
}
