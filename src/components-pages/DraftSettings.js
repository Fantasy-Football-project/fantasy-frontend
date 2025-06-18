import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { Link } from "react-router-dom";
import { getTeamInfo } from "./Roster";

export const appendAlert = (message, type) => {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

    if (!alertPlaceholder) {
        console.error('Alert placeholder element not found!');
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}

export const DraftSettings = () => {
    const [draftOrder, setDraftOrder] = useState([]);
    const [numTeams, setNumTeams] = useState();
    const [draftDate, setDraftDate] = useState(null);
    const [draftDone, setDraftDone] = useState(false);

    const[commissioner] = useState(getTeamInfo().commissioner);

    const randomizeDraftOrder = () => {
        const queryString = `/randomize-draft-order?leagueName=${getLeagueName()}`

        request(
            "PUT",
            queryString
        ).then((response) => {
            console.log(response.data);
            setDraftOrder(response.data);

        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        const querystring = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            querystring,
        ).then((response) => {
            setDraftOrder(response.data.draftOrder);
            setNumTeams(response.data.numTeams);
            setDraftDone(response.data.draftDone);

            if (response.data.draftDate !== null) {
                const newDraftDate = new Date(response.data.draftDate);
                setDraftDate(newDraftDate.toLocaleString());
            }
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, [])

    const renderDraftOrder = () => {
        return(
            draftOrder && (
                <ul>
                    {Object.keys(draftOrder).map(key => (
                        (key <= numTeams &&
                        <li key={key}>
                            Pick #{key} belongs to {draftOrder[key].teamName}
                        </li>)
                    ))}
                </ul>
            )
        );
    }

    const editDraftTime = () => {
        const currentDate = new Date();

        const selectedMonth = document.getElementById("month").value;
        const selectedDay = document.getElementById("day").value;
        const selectedTime = document.getElementById("time").value;
        
        const selectedDateString = `${selectedMonth} ${selectedDay}, ${currentDate.getFullYear()} ${selectedTime}`;

        const selectedDate = new Date(selectedDateString);
        
        if (currentDate > selectedDate) {
            appendAlert("Invalid date. Choose a future date.", "danger");
        }
        else {
            console.log(draftOrder);
            const queryString = `/set-draft-date?leagueName=${getLeagueName()}&draftDate=${selectedDate.toISOString()}`
            request(
                "PUT",
                queryString
            ).then((response) => {
                console.log(response);
            }).catch((error) => {
                appendAlert(error.response.data.message, "danger");
                console.log(error);
            })
        }
    }

    return(
        <div>
            <LeagueContentNavbar />
            
            {draftDate !== null && (<h3>Draft Date: {draftDate}</h3>)}

            {!draftDone && renderDraftOrder()}

            {commissioner && !draftDone &&
                <button onClick={randomizeDraftOrder} type="button" className="btn btn-info">Randomize Draft Order</button>}

            {!draftDone && <Link to='/draft-ui' type="button" class="btn btn-info">Enter Draft</Link>}

            {commissioner && !draftDone &&
            <button style={{ margin: "10px" }} type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Edit Draft Time
            </button>}

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Draft Time</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="liveAlertPlaceholder"></div>
                            <h1>Month</h1>
                            <select id="month" name="month" className="form-control">
																<option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                            </select>
                            <h1>Day</h1>
                            <input id="day" min="1" max="31" className="form-control" type="number" 
                                placeholder="Enter a day between 1 and 31" aria-label="day input"
                                onKeyDown={(e) => {
                                    //Only numbers are allowed.
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    //Number stays between 1 and 31.
                                    const value = parseInt(e.target.value);
                                    if (value < 1 || value > 31) {
                                        // Set the value to min or max if out of range
                                        if (e.target.value < 1) {
                                            e.target.value = 1;
                                        }
                                        else {
                                            if (document.getElementById("month").value === "September") {
                                                e.target.value = 30;
                                            }
                                            else {
                                                e.target.value = 31;
                                            }
                                        }
                                    }
                                }}/>

                            <h1>Time (EST)</h1>
                            <select id="time" name="time" className="form-control">
                                <option value="8:00">8:00 AM</option>
                                <option value="9:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="2:00">2:00 AM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="19:00">7:00 PM</option>
                                <option value="20:00">8:00 PM</option>
                                <option value="21:00">9:00 PM</option>
                                <option value="22:00">10:00 PM</option>
                                <option value="23:00">11:00 PM</option>
																<option value="22:10">10:10 PM</option>
                            </select>
                            
                            <button 
                            onClick={editDraftTime} 
                            className="btn btn-primary mt-3">Confirm Draft Time</button>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}