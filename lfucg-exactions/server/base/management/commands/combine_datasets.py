import pandas as pd


def combine():
  df_hist = pd.read_csv('lot_data.csv')
  
  df_new = pd.read_csv('oct_2018.csv')
  df_new.insert(0, 'New', 'New')
  df_non_repeat = df_new[~df_new['AddressID'].isin(df_hist['AddressID'])]

  df_combined = pd.concat([df_hist, df_non_repeat], keys="AddressID", sort=False)
  print('COMBINED', df_combined[:10])

  writer = pd.ExcelWriter('Combined Data.xlsx')
  df_combined.to_excel(writer, 'Total Data')

  writer.save()

  # duplicates = df_combined[df_combined['AddressID'].duplicated()]['AddressID']

  # df_drop_dupl = df_combined[(df_combined['AddressID'].isin(duplicates) & (df_combined['New'] == 'New'))]


# For use in shell_plus
# from base.management.commands.combine_datasets import combine


# def get_undefined_ledgers():
#   df = pd.read_csv('lot_data.csv')
#   print('Read CSV', df[:10])

#   lacking_resolutions_df = df[(((df['D_SewerCredits'] != 0) | (df['D_OtherCredits'] != 0) | (df['P_SewerCredits'] != 0) | (df['P_OtherCredits'] != 0)) & ((df['AccountLedgerAgreement-1'].isnull()) & (df['AccountLedgerAgreementType-1'] != 'MEMO')))]

#   writer = pd.ExcelWriter('Lots with agreement concerns.xlsx')
#   lacking_resolutions_df.to_excel(writer, 'Lack Resolution Numbers')

#   multiple_resolutions_df = df[(((df['AccountLedgerAgreement-1'].notnull()) | (df['AccountLedgerAgreementType-1'].notnull())) & ((df['AccountLedgerAgreement-2'].notnull()) | (df['AccountLedgerAgreementType-2'].notnull())))]
#   multiple_resolutions_df.to_excel(writer, 'Multiple Resolutions')

#   writer.save()
