class CreateTestPlans < ActiveRecord::Migration[5.2]
  def self.up
    create_table :tbl_sys_testplans,
    options:'ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin' do |t|
      t.string :CODE, null: true
      t.string :NAME, null: true
      t.string :CREATED_TIME, null: true
      t.string :CREATED_USER_ID, null: true
      t.string :ALTERED_TIME, null: true
      t.string :ALTERED_USER_ID, null: true
      t.text :PLAN, null: true
      t.string :PROJECT_ID, null: true
    end
    change_column :tbl_sys_testplans,:id,:string
  end
  def self.down
    drop_table :tbl_sys_testplans
  end
end
