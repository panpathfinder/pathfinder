/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
 */

package org.apache.cordova.test;

import java.util.ArrayList;
import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

/**
 * This class exposes methods in Cordova that can be called from JavaScript.
 */
public class Echo extends CordovaPlugin implements SensorEventListener {

	private SensorManager sensorManager;

	private Sensor accelarationSensor, magneticFieldSensor, stepCounterSensor,
			gravitationalFieldSensor, linearAccelarationSensor;

	private float[] magneticFieldValues;
	private float[] accelarationValues;
	private float[] gravitationalFieldValues;
	private float[] linearAccelarationValues;

	private List<float[]> magneticFieldValuesList = new ArrayList<float[]>();
	private List<float[]> accelarationValuesList = new ArrayList<float[]>();
	private List<float[]> gravitationalFieldValuesList = new ArrayList<float[]>();
	private List<float[]> linearAccelarationValuesList = new ArrayList<float[]>();

	private long lastTimeRecorded = 0;
	private float initalSteps = 0;

	private int stepsTaken;

	private String direction = "";

	private float degrees;

	/**
	 * Executes the request and returns PluginResult.
	 * 
	 * @param action
	 *            The action to execute.
	 * @param args
	 *            JSONArry of arguments for the plugin.
	 * @param callbackContext
	 *            The callback context from which we were invoked.
	 */
	@SuppressLint("NewApi")
	public boolean execute(String action, final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		if (action.equals("init")) {

			sensorManager = (SensorManager) cordova.getActivity()
					.getSystemService(Context.SENSOR_SERVICE);

			accelarationSensor = sensorManager
					.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

			gravitationalFieldSensor = sensorManager
					.getDefaultSensor(Sensor.TYPE_GRAVITY);

			magneticFieldSensor = sensorManager
					.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);

			linearAccelarationSensor = sensorManager
					.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);

			stepCounterSensor = sensorManager
					.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);

			int speedOfDetection = SensorManager.SENSOR_DELAY_FASTEST;

			sensorManager.registerListener(this, accelarationSensor,
					speedOfDetection);
			sensorManager.registerListener(this, magneticFieldSensor,
					speedOfDetection);
			sensorManager.registerListener(this, stepCounterSensor,
					speedOfDetection);
			sensorManager.registerListener(this, gravitationalFieldSensor,
					speedOfDetection);
			sensorManager.registerListener(this, linearAccelarationSensor,
					speedOfDetection);
			callbackContext.success();
		} else if (action.equals("poll")) {
			JSONObject json = new JSONObject();
			json.put("degree", degrees);
			json.put("direction", direction);
			json.put("steps", stepsTaken);
			initalSteps += stepsTaken;
			callbackContext.success(json);
		}

		return true;
	}

	public void onAccuracyChanged(Sensor sensor, int accuracy) {
	}

	public void onSensorChanged(SensorEvent event) {
		if (lastTimeRecorded <= 0) {
			lastTimeRecorded = System.currentTimeMillis();
		}
		switch (event.sensor.getType()) {
		case Sensor.TYPE_ACCELEROMETER:
			accelarationValues = event.values.clone();
			accelarationValuesList.add(accelarationValues);
			break;
		case Sensor.TYPE_MAGNETIC_FIELD:
			magneticFieldValues = event.values.clone();
			magneticFieldValuesList.add(magneticFieldValues);
			break;
		case Sensor.TYPE_GRAVITY:
			gravitationalFieldValues = event.values.clone();
			gravitationalFieldValuesList.add(gravitationalFieldValues);
			break;
		case Sensor.TYPE_LINEAR_ACCELERATION:
			linearAccelarationValues = event.values.clone();
			linearAccelarationValuesList.add(linearAccelarationValues);
			break;
		case Sensor.TYPE_STEP_COUNTER:
			if (initalSteps <= 0) {
				initalSteps = event.values[0];
				stepsTaken = 0;
			} else {
				stepsTaken = (int) (event.values[0] - initalSteps);
			}
			break;
		default:
			return;
		}

		if (accelarationValues != null && magneticFieldValues != null
				&& linearAccelarationValues != null
				&& gravitationalFieldValues != null) {
			updateValues();
		}
	}

	private float average(final List<float[]> valuesList, int index) {
		float sum = 0;

		for (float[] values : valuesList) {
			sum += values[index];
		}
		return sum / valuesList.size();
	}

	private void updateValues() {

		if (magneticFieldValuesList.size() < 100) {
			return;
		}

		for (int i = 0, len = magneticFieldValues.length; i < len; ++i) {
			magneticFieldValues[i] = average(magneticFieldValuesList, i);
		}
		magneticFieldValuesList.clear();

		for (int i = 0, len = accelarationValues.length; i < len; ++i) {
			accelarationValues[i] = average(accelarationValuesList, i);
		}
		accelarationValuesList.clear();

		for (int i = 0, len = gravitationalFieldValues.length; i < len; ++i) {
			gravitationalFieldValues[i] = average(gravitationalFieldValuesList,
					i);
		}
		gravitationalFieldValuesList.clear();

		for (int i = 0, len = linearAccelarationValues.length; i < len; ++i) {
			linearAccelarationValues[i] = average(linearAccelarationValuesList,
					i);
		}
		linearAccelarationValuesList.clear();

		float[] temp = new float[9];
		float[] R = new float[9];

		float[] matrix = temp;

		// Load rotation matrix into R
		SensorManager.getRotationMatrix(matrix, null, gravitationalFieldValues,
				magneticFieldValues);
		// Remap to camera's point-of-view
		SensorManager.remapCoordinateSystem(matrix, SensorManager.AXIS_X,
				SensorManager.AXIS_Z, R);
		// Return the orientation values
		float[] values = new float[3];
		SensorManager.getOrientation(matrix, values);
		// Convert to degrees
		for (int i = 0; i < values.length; i++) {
			Double degrees = (values[i] * 180) / Math.PI;
			values[i] = degrees.floatValue();
		}

		// Display the compass direction
		direction = getDirectionFromDegrees(values[0]);
		degrees = values[0];
	}

	private String getDirectionFromDegrees(float degrees) {
		if (degrees >= -22.5 && degrees < 22.5) {
			return "N";
		}
		if (degrees >= 22.5 && degrees < 67.5) {
			return "NE";
		}
		if (degrees >= 67.5 && degrees < 112.5) {
			return "E";
		}
		if (degrees >= 112.5 && degrees < 157.5) {
			return "SE";
		}
		if (degrees >= 157.5 || degrees < -157.5) {
			return "S";
		}
		if (degrees >= -157.5 && degrees < -112.5) {
			return "SW";
		}
		if (degrees >= -112.5 && degrees < -67.5) {
			return "W";
		}
		if (degrees >= -67.5 && degrees < -22.5) {
			return "NW";
		}

		return null;
	}

}
