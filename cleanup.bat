@echo off
echo ========================================
echo CLEANING UP REDUNDANT FILES
echo ========================================
echo.

REM --- DELETE REDUNDANT FILES ---

echo Deleting old user-level files...
del abandoned_sessions_features.csv
del abandoned_test.csv
del abandoned_train.csv
del abandoned_users_features_corrected.csv
del abandonment_recovery_simulated.csv

echo Deleting intermediate checkout files...
del cart_sessions_with_target.csv
del checkout_features_with_target.csv
del checkout_test.csv
del checkout_train.csv

echo Deleting old ML training files...
del ml_training_data.csv
del ml_training_data_final.csv
del ml_training_data_fixed.csv
del ml_test.csv
del ml_train.csv

echo Deleting old invoice files...
del overdue_invoices.csv
del overdue_invoices_fixed.csv
del overdue_invoices_ready.csv
del overdue_test.csv
del overdue_train.csv
del recovery_invoices_ready.csv

echo Deleting old simulation files...
del invoice_recovery_simulated.csv
del checkout_simulation_results.csv
del retry_recovery_simulated.csv
del all_invoices_with_ml_predictions.csv

echo Deleting old model files...
del logistic_regression_model.pkl
del random_forest_model.pkl

echo Deleting raw/original files...
del ecommerce_events.csv
del invoices.csv

echo Deleting temporary files...
del list_files.py
del razor.ipynb

echo.
echo ========================================
echo CLEANUP COMPLETE!
echo ========================================
echo.
echo KEPT FILES:
echo   ✅ ecommerce_clean.csv
echo   ✅ invoices_clean.csv
echo   ✅ invoices_with_ml_policy.csv
echo   ✅ checkout_predictions.csv
echo   ✅ selected_model.pkl
echo   ✅ scaler.pkl
echo   ✅ checkout_model.pkl
echo   ✅ checkout_scaler.pkl
echo   ✅ business_encoder.pkl
echo   ✅ terms_encoder.pkl
echo   ✅ cart_purchase_time_gaps.csv  (optional, keep if useful)
echo   ✅ ml_train_features.csv  (optional, keep if useful)
echo.
pause