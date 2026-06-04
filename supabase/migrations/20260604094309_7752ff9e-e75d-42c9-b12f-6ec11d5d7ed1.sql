
CREATE POLICY "Users upload own food images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users read own food images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own food images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);
