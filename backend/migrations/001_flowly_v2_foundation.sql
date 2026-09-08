-- FLOWLY V2 Foundation Migration
-- Additive migration: V1 remains backward compatible

BEGIN;

-- Allow composite business-scoped reference to staff
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'staff_business_id_id_key'
          AND conrelid = 'public.staff'::regclass
    ) THEN
        ALTER TABLE public.staff
        ADD CONSTRAINT staff_business_id_id_key
        UNIQUE (business_id, id);
    END IF;
END
$$;

-- Optional staff assignment for existing/new bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS staff_id UUID;

-- Staff assigned to a booking must belong to the same business
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'bookings_business_staff_fkey'
          AND conrelid = 'public.bookings'::regclass
    ) THEN
        ALTER TABLE public.bookings
        ADD CONSTRAINT bookings_business_staff_fkey
        FOREIGN KEY (business_id, staff_id)
        REFERENCES public.staff (business_id, id)
        ON DELETE SET NULL (staff_id);
    END IF;
END
$$;

-- Booking/schedule lookup
CREATE INDEX IF NOT EXISTS idx_bookings_business_staff_date
ON public.bookings (business_id, staff_id, booking_date);

COMMIT;
