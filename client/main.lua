ESX = exports['es_extended']:getSharedObject()
local PlayerData = ESX.GetPlayerData()
RegisterNetEvent('esx:playerLoaded', function(xPlayer)
    PlayerData = xPlayer
end)

RegisterNetEvent('esx:setJob', function(job)
    PlayerData.job = job
end)
