export interface Profile {
  id: number; full_name: string; position: string; org: string
  email: string; phone: string; about: string; photo_ref: string
}

export interface Category {
  id: number; code: string; name: string; color: string; sort_order: number
}

export interface Work {
  id: number; title: string; category_id: number | null
  fiscal_year: number; round: number
  summary: string; rationale: string; method: string; outcome: string
  target_qty: string; target_qual: string
  doc_url: string; cover_ref: string
  status: 'draft' | 'published'; is_hidden: boolean
  view_count: number; created_at: string; updated_at: string
}

export interface WorkRow extends Work {
  category_code: string | null; category_name: string | null; category_color: string | null
}

export interface WorkImage {
  id: number; work_id: number; image_ref: string; caption: string; sort_order: number
}
