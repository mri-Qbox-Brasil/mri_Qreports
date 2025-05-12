lib.addCommand('reporte', {
    help = 'Reporte um player'
}, function(source, raw)
    -- local player = exports.qbx_core:GetPlayer(args.id)
    TriggerClientEvent('mri_Qreports:toggleUI', source)
end)
